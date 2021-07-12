import React from 'react';

export function PlatformSelect() {
    return (
        <select id="platform" className="form-control">
            <option value="RU">RU</option>
            <option value="BR1">BR</option>
            <option value="EUN1">EUN</option>
            <option value="EUW1">EUW</option>
            <option value="JP1">JP</option>
            <option value="KR">KR</option>
            <option value="LA1">LA</option>
            <option value="LA2">LA</option>
            <option value="NA1">NA</option>
            <option value="OC1">OC</option>
            <option value="TR1">TR</option>
        </select>
    );
}