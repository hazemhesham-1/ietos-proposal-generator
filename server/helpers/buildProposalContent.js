const fs = require("fs");
const path = require("path");

const writtenNumber = require("written-number");

function buildProposalContent(data) {
    const {
        language,
        reports,
        workValue: monthlyAmount,
    } = data;

    const projectGovernorate = JSON.parse(data.projectGovernorate);
    const plantType = JSON.parse(data.plantType);
    const currency = JSON.parse(data.currency);

    const translatedGovernorate = language === "ar" ? projectGovernorate.name_ar : projectGovernorate.name_en;
    const translatedPlantType = language === "ar" ? plantType.name_ar : plantType.name_en;
    const translatedCurrency = language === "ar" ? currency.name_ar : currency.name_en;

    const dataPath = path.join(__dirname, "../data", "operations.json");
    const operations = JSON.parse(fs.readFileSync(dataPath, "utf-8"));

    const tasksList = filterAndMap(operations.tasks, data.operationScope, language);
    const manpowerList = filterAndMap(operations.manpower, data.manpower, language);
    const chemicalsList = filterAndMap(operations.chemicals, data.chemicalManagement, language);
    const excludedTasksList = filterAndMap(operations.tasks, data.operationScope, language, false);

    const maintenanceTasks = processItems(operations.schedules, data.operationSchedule, {
        daily: [],
        weekly: [],
        monthly: [],
    }, language);
    
    const replacementsTasks = processItems(operations.replacements, data.replacements, {
        parts: [],
        process: [],
    }, language);

    const monthlyTax = (monthlyAmount * 0.14).toFixed(1);
    const annualTax = (monthlyAmount * 12 * 0.14).toFixed(1);
    const totalMonthlyAmount = Math.round(monthlyAmount * 1.14);
    const totalAnnualAmount = Math.round(monthlyAmount * 1.14 * 12);

    const proposalContent = {
        ...data,
        currency: currency.value,
        projectGovernorate: translatedGovernorate,
        plantType: translatedPlantType,
        maintenanceTasks,
        hasDaily: maintenanceTasks.daily.length > 0,
        hasWeekly: maintenanceTasks.weekly.length > 0,
        hasMonthly: maintenanceTasks.monthly.length > 0,
        operationScope: tasksList,
        manpower: manpowerList,
        chemicalManagement: chemicalsList,
        excludedTasks: excludedTasksList,
        reports: {
            doesExist: reports.length > 0,
            list: reports?.map((item) => ({ value: item.value }))
        },
        replacements: {
            ...replacementsTasks,
            hasSparePartsList: replacementsTasks.parts.length > 0,
            hasExtraReplacements: replacementsTasks.process.length > 0,
        },
        workValue: {
            monthlyAmount: monthlyAmount,
            monthlyAmountText: `${writtenNumber(monthlyAmount, { lang: language })} ${translatedCurrency}`,
            monthlyTax,
            totalMonthlyAmountValue: totalMonthlyAmount,
            totalMonthlyAmountText: `${writtenNumber(totalMonthlyAmount, { lang: language })} ${translatedCurrency}`,
            annualAmount: monthlyAmount * 12,
            annualAmountText: `${writtenNumber(monthlyAmount * 12, { lang: language })} ${translatedCurrency}`,
            annualTax,
            totalAnnualAmountValue: totalAnnualAmount,
            totalAnnualAmountText: `${writtenNumber(totalAnnualAmount, { lang: language })} ${translatedCurrency}`
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