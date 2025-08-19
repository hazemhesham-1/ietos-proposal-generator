const fs = require("fs");
const path = require("path");
const Docxtemplater = require("docxtemplater");
const PizZip = require("pizzip");
const { DOMParser } = require("@xmldom/xmldom");

const buildProposalContent = require("../helpers/buildProposalContent");

async function generateDocx(req, res) {
    const formData = req.body;
    if(!formData) {
        return res.status(400).json({ error: "Missing required form data" });
    }

    const documentContent = await buildProposalContent(formData);
    const templatePath = path.resolve(__dirname, `../templates/${formData.documentCode}`, `template-${formData.language}.docx`);
    const content = fs.readFileSync(templatePath, "binary");

    const zip = new PizZip(content);
    const document = new Docxtemplater(zip, {
        paragraphLoop: true,
        linebreaks: true,
        parser: (tag) => ({ get: (s) => s[tag] }),
        xmlParser: (xml) => new DOMParser().parseFromString(xml, "text/xml")
    });
    
    try {
        document.render(documentContent);
    }
    catch(err) {
        return res.status(500).send(`Error rendering docx: ${err.message}`);
    }

    const buffer = document.getZip().generate({ type: "nodebuffer" });

    res.set({
        "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Content-Disposition": `attachment; filename=${formData.id}.docx`,
    });
    res.send(buffer);
}

module.exports = { generateDocx };