const fs = require("fs");
const path = require("path");
const express = require("express");
const router = express.Router();

const Docxtemplater = require("docxtemplater");
const PizZip = require("pizzip");
const { DOMParser } = require("@xmldom/xmldom");

router.post("/generate", (req, res) => {
    const proposalData = req.body;

    const dataPath = path.join(__dirname, "../data", "operations.json");
    const jsonData = JSON.parse(fs.readFileSync(dataPath, "utf-8"));

    const operationTaskMap = new Map(jsonData.tasks.map((task) => [task.id, task.label]));
    const chemicalMap = new Map(jsonData.chemicals.map((task) => [task.id, task.label]));
    const excludedTasks = jsonData.tasks.filter((task) => !proposalData.operationScope.includes(task.id));

    const maintenanceTasks = {
        daily: [],
        weekly: [],
        monthly: []
    };

    for(const period in jsonData.schedules) {
        jsonData.schedules[period].forEach((item) => {
            if(proposalData.operationSchedule.includes(item.id)) {
                maintenanceTasks[period].push({ value: item.label });
            }
        });
    }

    const proposalContent = {
        ...proposalData,
        maintenanceTasks,
        operationScope: proposalData.operationScope.map((operation) => ({ value: operationTaskMap.get(operation) })),
        chemicalManagement: proposalData.chemicalManagement.map((operation) => ({ value: chemicalMap.get(operation) })),
        excludedTasks: excludedTasks.map((task) => ({ value: task.label })),
    };

    const templatePath = path.resolve(__dirname, "../templates", "template.docx");
    const content = fs.readFileSync(templatePath, "binary");

    const zip = new PizZip(content);
    const document = new Docxtemplater(zip, {
        paragraphLoop: true,
        linebreaks: true,
        parser: (tag) => ({ get: (s) => s[tag] }),
        xmlParser: (xml) => new DOMParser().parseFromString(xml, "text/xml")
    });
    
    try {
        document.render(proposalContent);
    }
    catch(err) {
        return res.status(500).send(`Error rendering docx: ${err.message}`);
    }

    const buffer = document.getZip().generate({ type: "nodebuffer" });

    res.set({
        "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Content-Disposition": `attachment; filename=${proposalData.id}.docx`,
    });
    res.send(buffer);
});

module.exports = router;