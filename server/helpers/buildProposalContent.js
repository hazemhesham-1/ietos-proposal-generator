const fs = require("fs");
const path = require("path");

const writtenNumber = require("written-number");

function buildProposalContent(data) {
    const { language: lang, workValue: monthlyAmount } = data;

    const projectGovernorate = JSON.parse(data.projectGovernorate);
    const plantType = JSON.parse(data.plantType);
    const currency = JSON.parse(data.currency);

    const totalMonthlyAmount = Math.round(monthlyAmount * 1.14);
    const totalAnnualAmount = Math.round(monthlyAmount * 1.14 * 12);

    const dataPath = path.join(__dirname, "../data", "operations.json");
    const operations = JSON.parse(fs.readFileSync(dataPath, "utf-8"));

    const scheduleTasks = processItems(operations.schedules, data.operationSchedule, {
        daily: [],
        weekly: [],
        monthly: [],
    }, lang);
    
    const replacementTasks = processItems(operations.replacements, data.replacements, {
        parts: [],
        process: [],
    }, lang);

    const proposalContent = {
        ...data,
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
            totalAnnualAmountText: `${writtenNumber(totalAnnualAmount, { lang })} ${currency.name[lang]}`
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