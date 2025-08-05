const fs = require("fs");
const path = require("path");

const writtenNumber = require("written-number");
writtenNumber.defaults.lang = "ar";

function buildProposalContent(data) {
    const dataPath = path.join(__dirname, "../data", "operations.json");
    const operations = JSON.parse(fs.readFileSync(dataPath, "utf-8"));

    const operationTaskMap = new Map(operations.tasks.map((task) => [task.id, task.label]));
    const chemicalMap = new Map(operations.chemicals.map((task) => [task.id, task.label]));
    const excludedTasks = operations.tasks.filter((task) => !data.operationScope.includes(task.id));

    const maintenanceTasks = {
        daily: [],
        weekly: [],
        monthly: [],
    };

    for(const period in operations.schedules) {
        operations.schedules[period].forEach((item) => {
            if(data.operationSchedule.includes(item.id)) {
                maintenanceTasks[period].push({ value: item.label });
            }
        });
    }

    const totalMonthlyAmount = data.workValue * 1.14;
    const totalAnnualAmount = Math.round(data.workValue * 1.14 * 12);

    const proposalContent = {
        ...data,
        maintenanceTasks,
        hasDaily: maintenanceTasks.daily.length > 0,
        hasWeekly: maintenanceTasks.weekly.length > 0,
        hasMonthly: maintenanceTasks.monthly.length > 0,
        operationScope: data.operationScope.map((operation) => ({ value: operationTaskMap.get(operation) })),
        chemicalManagement: data.chemicalManagement.map((operation) => ({ value: chemicalMap.get(operation) })),
        excludedTasks: excludedTasks.map((task) => ({ value: task.label })),
        workValue: {
            monthlyAmount: data.workValue,
            monthlyAmountText: `${writtenNumber(data.workValue)} ${data.currency.split("-")[1]}`,
            monthlyTax: data.workValue * 0.14,
            totalMonthlyAmountValue: totalMonthlyAmount,
            totalMonthlyAmountText: `${writtenNumber(totalMonthlyAmount)} ${data.currency.split("-")[1]}`,
            annualAmount: data.workValue * 12,
            annualAmountText: `${writtenNumber(data.workValue * 12)} ${data.currency.split("-")[1]}`,
            annualTax: data.workValue * 12 * 0.14,
            totalAnnualAmountValue: totalAnnualAmount,
            totalAnnualAmountText: `${writtenNumber(totalAnnualAmount)} ${data.currency.split("-")[1]}`
        }
    };

    return proposalContent;
}

module.exports = buildProposalContent;