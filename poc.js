/**
 * Decodes a StarCraft 2 SALT string based on the teavver/sc2-salt-visualizer logic.
 * @param {string} saltString - The raw SALT string from the game or clipboard.
 */
function decodeSALT(saltString) {
    // Stage 1: Convert entire string to a numeric array (0-94)
    const values = Array.from(saltString).map(char => char.charCodeAt(0) - 32);

    if (values.length === 0) throw new Error("Empty SALT string");

    // Stage 2: Parse Header
    const version = values[0];

    // Find the tilde delimiter (value 94) within the numeric array
    const titleEndIndex = values.indexOf(94, 1);
    if (titleEndIndex === -1) {
        throw new Error("Invalid SALT format: Title delimiter not found.");
    }

    // Extract title by converting numeric values back to ASCII characters
    const title = values.slice(1, titleEndIndex)
        .map(v => String.fromCharCode(v + 32))
        .join('');

    // Stage 3: Parse Build Steps
    // Version 1 uses a 5-integer stride for each build step
    const steps = [];
    const stepData = values.slice(titleEndIndex + 1);

    for (let i = 0; i < stepData.length; i += 5) {
        // Ensure there is enough data for a full step
        if (i + 4 >= stepData.length) break;

        steps.push({
            type: stepData[i],      // 0: Structure, 1: Unit, 2: Morph, 3: Upgrade
            id: stepData[i + 1],    // The internal Game ID for the item
            supply: stepData[i + 2], // The player's supply count at execution
            minutes: stepData[i + 3],
            seconds: stepData[i + 4]
        });
    }

    // const decoded = values.map((i) => String.fromCharCode(i+32))
    // NOPE not working...

    return {
        values,
        version,
        title,
        steps
    };
}

// Example usage:
try {
    const saltString = "!My Opening~  ! @ #"; // Illustrative SALT string
    const result = decodeSalt(saltString);
    console.log("Build Title:", result.title);
    console.log("Steps Count:", result.steps.length);
} catch (e) {
    console.error(e.message);
}
