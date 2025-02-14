import { DOMParser } from "@xmldom/xmldom";

// Function to parse XML file and convert to JSON
export async function parseXmlFileToJson(filePath: string): any {
  try {
    // Read the XML file as text
    const xmlText = await Deno.readTextFile(filePath);

    // Parse the XML text using DOMParser
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, "application/xml");

    // Check for parsing errors
    const parserError = xmlDoc.getElementsByTagName("parsererror");
    if (parserError.length > 0) {
      console.error("Error parsing XML:", parserError[0].textContent);
      return;
    }

    // Convert XML document to JSON
    const json = xmlToJson(xmlDoc);
    return json;
  } catch (error) {
    console.error("Error reading or parsing the file:", error);
  }
}

// Function to convert XML to JSON
function xmlToJson(xml: any): any {
  // Create the return object
  let obj: any = {};

  if (xml.nodeType === 1) { // element
    // Do attributes
    if (xml.attributes.length > 0) {
      obj["@attributes"] = {};
      for (let j = 0; j < xml.attributes.length; j++) {
        const attribute = xml.attributes.item(j);
        obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
      }
    }
  } else if (xml.nodeType === 3) { // text
    obj = xml.nodeValue;
  }

  // Do children
  if (xml.hasChildNodes()) {
    for (let i = 0; i < xml.childNodes.length; i++) {
      const item = xml.childNodes.item(i);
      const nodeName = item.nodeName;
      if (typeof (obj[nodeName]) === "undefined") {
        obj[nodeName] = xmlToJson(item);
      } else {
        if (typeof (obj[nodeName].push) === "undefined") {
          const old = obj[nodeName];
          obj[nodeName] = [];
          obj[nodeName].push(old);
        }
        obj[nodeName].push(xmlToJson(item));
      }
    }
  }
  return obj;
}
