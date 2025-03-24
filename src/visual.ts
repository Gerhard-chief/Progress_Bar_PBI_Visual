"use strict";

import powerbi from "powerbi-visuals-api";
import { FormattingSettingsService } from "powerbi-visuals-utils-formattingmodel";
import "./../style/visual.less";

import VisualConstructorOptions = powerbi.extensibility.visual.VisualConstructorOptions;
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions;
import IVisual = powerbi.extensibility.visual.IVisual;

import { VisualFormattingSettingsModel } from "./settings";

export class Visual implements IVisual {
    private target: HTMLElement;
    private barElement: HTMLDivElement;
    private fillElement: HTMLDivElement;
    private formattingSettings: VisualFormattingSettingsModel;
    private formattingSettingsService: FormattingSettingsService;

    constructor(options: VisualConstructorOptions) {
        console.log('Visual constructor', options);
        this.formattingSettingsService = new FormattingSettingsService();
        this.target = options.element;

        // Обёртка для статус-бара
        this.barElement = document.createElement("div");
        this.barElement.style.width = "100%";
        this.barElement.style.height = "20px";
        this.barElement.style.backgroundColor = "#e0e0e0";
        this.barElement.style.borderRadius = "4px";

        // Заполненная часть статус-бара
        this.fillElement = document.createElement("div");
        this.fillElement.style.height = "100%";
        this.fillElement.style.width = "50%"; // временно 50%, заменим в update
        this.fillElement.style.backgroundColor = "#4682b4";
        this.fillElement.style.borderRadius = "4px";
        this.barElement.appendChild(this.fillElement);

        this.target.appendChild(this.barElement);
    }

    public update(options: VisualUpdateOptions) {
        this.formattingSettings = this.formattingSettingsService.populateFormattingSettingsModel(
            VisualFormattingSettingsModel,
            options.dataViews[0]
        );

        console.log("Visual update", options);

        // Получим значение из measure, если оно есть
        const value = options.dataViews?.[0]?.single?.value;
        const percent = typeof value === "number" ? Math.max(0, Math.min(100, value)) : 0;

        this.fillElement.style.width = `${percent}%`;
    }

    public getFormattingModel(): powerbi.visuals.FormattingModel {
        return this.formattingSettingsService.buildFormattingModel(this.formattingSettings);
    }
}
