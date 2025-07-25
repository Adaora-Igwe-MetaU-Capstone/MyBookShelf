import { useEffect, useState } from "react";

function ThemeSelector() {
    const [theme, setTheme] = useState('cozy');

    useEffect(() => {
        document.body.className = `theme-${theme}`;
    }, [theme]);

    return (
        <div style={{ margin: "1rem" }}>
            <label htmlFor="theme-select">Theme: </label>
            <select
                id="theme-select"
                value={theme}
                onChange={e => setTheme(e.target.value)}
            >
                <option value="cozy">Cozy</option>
                <option value="warm">Warm</option>
                <option value="nostalgic">Nostalgic</option>
            </select>
        </div>
    );
}

export default ThemeSelector;
