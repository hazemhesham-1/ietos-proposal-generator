const fs = require("fs");
const path = require("path");

const writtenNumber = require("written-number");

function readFile(fileName) {
    const dataPath = path.join(__dirname, "../data", fileName);
    const parsedJson = JSON.parse(fs.readFileSync(dataPath, "utf-8"));

    return parsedJson;
}

function getOptionLabel(options, key, value) {
    const matchedOptions = options.find((option) => option.key === key)?.options;
    const labels = matchedOptions.find((option) => option.value === value)?.labels;
    return labels;
}

function buildProposalContent(data) {
    const { language: lang, workValue: monthlyAmount, documentCode } = data;

    const projectGovernorate = JSON.parse(data.projectGovernorate);
    const plantType = JSON.parse(data.plantType);
    const currency = JSON.parse(data.currency);

    const totalMonthlyAmount = Math.round(monthlyAmount * 1.14);
    const totalAnnualAmount = Math.round(monthlyAmount * 1.14 * 12);

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

    const installations = [];
    let totalCost = 0;

    if(documentCode === "REH") {
        const equipments = readFile("equipments.json");
        const actions = readFile("actions.json");
        const specs = readFile("specification.json");

        for(let i = 0; i < data.equipments.length; ++i) {
            const item = data.equipments[i];
            const { unit, quantity } = item;
            const actionLabel = actions.find(({ value }) => value === item.actionType).label[lang];
            const category = equipments.find(({ value }) => value === item.category);
            const subCategories = category?.data[lang];
            const equipmentLabel = subCategories.equipments.find(({ value }) => value === item.equipment).label;

            const casingMaterial = getOptionLabel(specs, "casingMaterial", item?.casingMaterial)?.en;
            const impellerMaterial = getOptionLabel(specs, "impellerMaterial", item?.impellerMaterial)?.en;
            const shaftMaterial = getOptionLabel(specs, "shaftMaterial", item?.shaftMaterial)?.en;
            const protection = getOptionLabel(specs, "protection", item?.protection)?.en;

            const totalPrice = unit !== "LS" ? Number(item.price) * item.quantity : Number(item.price);
            totalCost += totalPrice;

            if(lang === "ar") {
                const unitLabel = getOptionLabel(specs, "unit", unit)[lang];

                const supplyItem = `${item.type ? item.type : equipmentLabel}${item.location ? ` في ${item.location}` : ""}`;
                const task = `${actionLabel} ${supplyItem}`;
                const processedItem = {
                    ...item,
                    index: i+1,
                    task,
                    item: supplyItem,
                    unit: unitLabel,
                    quantity,
                    casingMaterial,
                    impellerMaterial,
                    shaftMaterial,
                    protection,
                    totalPrice
                };
                installations.push(processedItem);
            }
            else if(lang === "en") {
                const supplyItem = `${item.type ? item.type : equipmentLabel}${item.location ? ` at ${item.location}` : ""}`;
                const task = `${actionLabel} of ${supplyItem}`;
                const processedItem = {
                    ...item,
                    index: i+1,
                    task,
                    item: supplyItem,
                    unit,
                    quantity,
                    casingMaterial,
                    impellerMaterial,
                    shaftMaterial,
                    protection,
                    totalPrice
                };
                installations.push(processedItem);
            }
        }
    }

    const proposalContent = {
        ...data,
        equipments: {
            installations
        },
        projectGovernorate: projectGovernorate.name[lang],
        plantType: plantType.name[lang],
        workScope: {
            tasks: filterAndMap(operations.tasks, data.operationScope, lang),
            operationSchedule: {
                hasDaily: scheduleTasks.daily.length > 0,
                hasWeekly: scheduleTasks.weekly.length > 0,
                hasMonthly: scheduleTasks.monthly.length > 0,
                ...scheduleTasks
            },
            replacements: {
                hasSparePartsList: replacementTasks.parts.length > 0,
                hasExtraReplacements: replacementTasks.process.length > 0,
                ...replacementTasks,
            },
            reports: data.reports.map((item) => ({ value: item.value })),
            manpower: filterAndMap(operations.manpower, data.manpower, lang),
            chemicalManagement: filterAndMap(operations.chemicals, data.chemicalManagement, lang),
            excludedTasks: filterAndMap(operations.tasks, data.operationScope, lang, false),
        },
        finance: {
            monthlyAmount: monthlyAmount,
            currency: currency.name[lang],
            currencyISO: currency.value,
            monthlyAmountText: `${writtenNumber(monthlyAmount, { lang })} ${currency.name[lang]}`,
            monthlyTax: (monthlyAmount * 0.14).toFixed(1),
            totalMonthlyAmountValue: totalMonthlyAmount,
            totalMonthlyAmountText: `${writtenNumber(totalMonthlyAmount, { lang })} ${currency.name[lang]}`,
            annualAmount: monthlyAmount * 12,
            annualAmountText: `${writtenNumber(monthlyAmount * 12, { lang })} ${currency.name[lang]}`,
            annualTax: (monthlyAmount * 12 * 0.14).toFixed(1),
            totalAnnualAmountValue: totalAnnualAmount,
            totalAnnualAmountText: `${writtenNumber(totalAnnualAmount, { lang })} ${currency.name[lang]}`,
            totalCost,
            totalCostText: `${writtenNumber(totalCost, { lang })} ${currency.name[lang]}`,
        }
    };

    return proposalContent;
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

module.exports = buildProposalContent;