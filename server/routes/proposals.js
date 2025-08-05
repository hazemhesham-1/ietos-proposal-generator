const fs = require("fs");
const path = require("path");
const express = require("express");
const router = express.Router();

const Docxtemplater = require("docxtemplater");
const PizZip = require("pizzip");
const { DOMParser } = require("@xmldom/xmldom");

const buildProposalContent = require("../helpers/buildProposalContent");

router.post("/generate", (req, res) => {
    const proposalData = req.body;
    const proposalContent = buildProposalContent(proposalData);

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