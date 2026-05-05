/**
 * Decodes a SALT string into a structured build order object.
 * Reference: Based on Spawning Tool's SALT implementation logic.
 *
 * @param {string} saltString - The raw SALT string (e.g., "!ZMy Build~...")
 * @returns {Object} Structured build order
 */
function decodeSALT(saltString) {
    // Base95 decoding: ASCII value minus 32 (Space character)
    const getBase95 = (char) => char.charCodeAt(0) - 32;

    // 1. Clean the string
    // CRITICAL: Do not remove spaces, as Space (' ') is a valid Base95 character (value 0).
    // Only strip standard line breaks.
    const cleanStr = saltString.replace(/[\r\n]+/g, '');

    // 2. Parse the Header
    const delimiterIndex = cleanStr.indexOf('~');
    if (delimiterIndex === -1) {
        throw new Error("Invalid SALT string: Missing '~' delimiter.");
    }

    const version = getBase95(cleanStr[0]);

    // Spawning Tool typically stores the Race as the character immediately after Version
    const raceChar = cleanStr[1];
    const raceMap = { 'T': 'Terran', 'Z': 'Zerg', 'P': 'Protoss' };
    const race = raceMap[raceChar] || "Unknown";

    // Title is everything between the race character and the delimiter
    const title = cleanStr.substring(2, delimiterIndex);

    // 3. Parse the Build Steps (in 6-character chunks)
    const buildStepsStr = cleanStr.substring(delimiterIndex + 1);
    const buildSteps = [];

    for (let i = 0; i < buildStepsStr.length; i += 6) {
        const chunk = buildStepsStr.substring(i, i + 6);

        // Ignore incomplete trailing chunks
        if (chunk.length < 6) break;

        // Extract values using Base95
        const supplyVal = getBase95(chunk[0]);
        const minutes = getBase95(chunk[1]);
        const seconds = getBase95(chunk[2]);
        const type = getBase95(chunk[4]);
        const itemId = getBase95(chunk[5]);

        // Format Game Time as MM:SS
        const minStr = minutes.toString().padStart(2, '0');
        const secStr = seconds.toString().padStart(2, '0');

        buildSteps.push({
            gametime: `${minStr}:${secStr}`,
            supply: supplyVal, // Note: Add offsets here if adjusting for WoL/LotV starting supplies
            item: type,
            itemId: itemId
        });
    }

    return {
        version: version,
        title: title,
        race: race,
        buildSteps: buildSteps
    };
}

// --- Example Usage ---
// ! (Version 1) | P (Protoss) | Test Build | ~ (Delimiter)
// chunk 1: Space(0)!(1)/(15) (0) (0)b(66) => Supply 0, 01:15, Type 0, Item 66
// const mockSALT = "!PTest Build~ !/  b";
// console.log(JSON.stringify(decodeSALT(mockSALT), null, 2));
