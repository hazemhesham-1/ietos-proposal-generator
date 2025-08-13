const { convertNumberToText, readFile, parseJson } = require("../utils/fileUtils");

function buildProposalContent(data) {
    const { language: lang, documentCode } = data;

    const projectGovernorate = parseJson(data.projectGovernorate);
    const plantType = parseJson(data.plantType);
    const currency = parseJson(data.currency);

    const operationsData = {};
    const financialData = {};

    if(documentCode === "REH") {
        const equipments = readFile("equipments.json");
        const actions = readFile("actions.json");
        const specs = readFile("specification.json");

        const installationTasks = [];
        let totalCost = 0;

        for(let i = 0; i < data.equipments.length; ++i) {
            const item = getEquipmentData(data.equipments[i], { actions, equipments, specs }, lang);
            totalCost += item.totalPrice;
            installationTasks.push({ ...item, index: i+1 });
        }

        operationsData.tasks = installationTasks;
        financialData.totalCost = totalCost;
        financialData.totalCostText = `${convertNumberToText(totalCost, lang)} ${currency.name[lang]}`;
    }
    else {
        const { workValue: monthlyAmount } = data;

        const operations = readFile("operations.json");

        const scheduleTasks = processItems(operations.schedules, data.operationSchedule, {
            daily: [],
            weekly: [],
            monthly: [],
        }, lang);
        
        const replacementTasks = processItems(operations.replacements, data.replacements, {
            parts: [],
            process: [],
        }, lang);

        operationsData.operationSchedule = {
            ...scheduleTasks,
            hasDaily: scheduleTasks.daily.length > 0,
            hasWeekly: scheduleTasks.weekly.length > 0,
            hasMonthly: scheduleTasks.monthly.length > 0,
        };
        operationsData.replacements = {
            ...replacementTasks,
            hasSparePartsList: replacementTasks.parts.length > 0,
            hasExtraReplacements: replacementTasks.process.length > 0,
        };
        operationsData.tasks = filterAndMap(operations.tasks, data.operationScope, lang);
        operationsData.reports = data.reports.map((item) => ({ value: item.value }));
        operationsData.manpower = filterAndMap(operations.manpower, data.manpower, lang);
        operationsData.chemicalManagement = filterAndMap(operations.chemicals, data.chemicalManagement, lang);
        operationsData.excludedTasks = filterAndMap(operations.tasks, data.operationScope, lang, false);

        const totalMonthlyAmount = Math.round(monthlyAmount * 1.14);
        const totalAnnualAmount = Math.round(monthlyAmount * 1.14 * 12);

        financialData.monthlyAmount = monthlyAmount;
        financialData.monthlyAmountText = `${convertNumberToText(monthlyAmount, lang)} ${currency.name[lang]}`;
        financialData.monthlyTax = (monthlyAmount * 0.14).toFixed(1);
        financialData.totalMonthlyAmountValue = totalMonthlyAmount;
        financialData.totalMonthlyAmountText = `${convertNumberToText(totalMonthlyAmount, lang)} ${currency.name[lang]}`;
        financialData.annualAmount = monthlyAmount * 12;
        financialData.annualAmountText = `${convertNumberToText(monthlyAmount * 12, lang)} ${currency.name[lang]}`;
        financialData.annualTax = (monthlyAmount * 12 * 0.14).toFixed(1);
        financialData.totalAnnualAmountValue = totalAnnualAmount;
        financialData.totalAnnualAmountText = `${convertNumberToText(totalAnnualAmount, lang)} ${currency.name[lang]}`;
    }

    const proposalContent = {
        ...data,
        issueDateString: new Date(data.issueDate).toLocaleString(lang === "ar" ? "ar-EG" : "en-US", { month: "long", year: "numeric" }),
        projectGovernorate: projectGovernorate?.name[lang],
        plantType: plantType?.name[lang],
        plantTypeShort: plantType?.short,
        treatmentType: plantType?.treatment[lang],
        workScope: operationsData,
        finance: {
            ...financialData,
            currency: currency.name[lang],
            currencyISO: currency.value,
        }
    };

    return proposalContent;
}

function getOptionLabel(options, key, value) {
    const matchedOptions = options.find((option) => option.key === key)?.options;
    const labels = matchedOptions.find((option) => option.value === value)?.labels;
    return labels;
}

function processItems(list, items, groupedItems, language = "en") {
    list.forEach((group) => (
        group.list.forEach((item) => {
            if(items.includes(item.id)) {
                groupedItems[group.value].push({ value: item.label[language] });
            }
        })
    ));

    return groupedItems;
}

function filterAndMap(data, list, language = "en", included = true) {
    const filteredData = data.filter((item) => list.includes(item.id) === included);
    const mappedData = filteredData.map((item) => ({ value: item.label[language] }));
    
    return mappedData;
}

function getEquipmentData(item, resources, lang = "en") {
    const { unit, quantity } = item;
    const { actions, equipments, specs } = resources;

    const actionLabel = actions.find(({ value }) => value === item.actionType).label[lang];
    const category = equipments.find(({ value }) => value === item.category)?.data[lang];
    const equipmentLabel = category.equipments.find(({ value }) => value === item.equipment).label;

    const processedItem = {};
    if(lang === "ar") {
        const supplyItem = `${item.type ? item.type : equipmentLabel}${item.location ? ` في ${item.location}` : ""}`;
        processedItem.task = `${actionLabel} ${supplyItem}`;
        processedItem.item = supplyItem;
        processedItem.unit = getOptionLabel(specs, "unit", unit)[lang];
    }
    else if(lang === "en") {
        let supplyItem = `${item.type ? capitalizeText(item.type) : equipmentLabel}`;
        supplyItem += `${item.location ? ` at ${capitalizeText(item.location)}` : ""}`;
        processedItem.task = `${actionLabel} of ${supplyItem}`;
        processedItem.item = supplyItem;
        processedItem.unit = unit;
    }

    const casingMaterial = getOptionLabel(specs, "casingMaterial", item?.casingMaterial)?.en;
    const impellerMaterial = getOptionLabel(specs, "impellerMaterial", item?.impellerMaterial)?.en;
    const shaftMaterial = getOptionLabel(specs, "shaftMaterial", item?.shaftMaterial)?.en;
    const protection = getOptionLabel(specs, "protection", item?.protection)?.en;

    const itemDetails = {
        ...item,
        quantity,
        casingMaterial,
        impellerMaterial,
        shaftMaterial,
        protection,
    };

    const itemData = {
        ...processedItem,
        specifications: getEquipmentSpecs(itemDetails),
        quantity,
        price: item.price,
        totalPrice: unit !== "LS" ? Number(item.price) * item.quantity : Number(item.price),
    };
    
    return itemData;
}

function getEquipmentSpecs(item) {
    const specifications = [];
    const parameters = {
        quantity: "Quantity\t\t:\t{value}",
        type: "Type\t\t\t:\t{value}",
        flow: "Flow\t\t\t:\t{value} m3/Hr.",
        head: "Head\t\t\t:\t{value} m",
        headPressure: "Head\t\t\t:\t{value} mBar",
        casingMaterial: "Casing Material\t\t:\t{value}",
        shaftMaterial: "Shaft Material\t\t:\t{value}",
        impellerMaterial: "Impeller Material\t:\t{value}",
        valves: "Valves\t\t\t:\t{value}",
        size: "Size\t\t\t:\t{value}\"",
        diameter: "Filter Diameter\t\t:\t{value} mm",
        height: "Effective Height\t\t:\t{value} mm",
        protection: "Protection\t\t:\t{value}",
        manufacturer: "Manufacturer\t\t:\t{value}",
        origin: "Origin\t\t\t:\t{value}"
    };

    for(const key in parameters) {
        if((key in item) && (item[key] !== undefined)) {
            const value = parameters[key].replace("{value}", item[key]);
            specifications.push({ value });
        }
    }

    return specifications;
}

module.exports = buildProposalContent;