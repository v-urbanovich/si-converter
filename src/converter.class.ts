export interface IConverterOption {
    id: string;
    translateKey: string;
    value: number;
}

export interface IConvertedData {
    id: string;
    value: number;
    translateKey: string;
    roundedValue: number;
    isBaseMeasurement: boolean;
}

/**
 * Converter class
 */
export class Converter {
    private optionsArray: IConverterOption[];
    private baseMeasurement: string;
    private optionsMap!: Map<string, IConverterOption>;

    public constructor(options: IConverterOption[]) {
        // sort options
        this.optionsArray =  options.sort((option1, option2) => option1.value - option2.value);

        // set base measurement -> option with value equal to 1
        const baseOption = this.optionsArray.find((option: IConverterOption) => option.value === 1);
        if (!baseOption) {
            throw new Error('You must provide option with value 1 as base option!');
        }
        this.baseMeasurement = baseOption.id;

        // create options map for easy access
        this.setOptionsMap();
    }

    /**
     * Method allows to change base measurement and recalculate relations
     */
    public setBaseOption(optionKey: string) {
        const newBaseOption: IConverterOption | undefined = this.optionsMap.get(optionKey);
        if (!newBaseOption) {
            throw new Error(`Provided optionKey "${optionKey}" is missing`);
        }
        const modifier: number = 1 / newBaseOption.value;
        this.optionsArray = this.optionsArray.map((option: IConverterOption) => ({
            ...option,
            value: option.id === optionKey ? 1 : option.value * modifier
        }));
        this.baseMeasurement = newBaseOption.id;
        this.setOptionsMap();
    }

    /**
     * Method for converting value from one measurement to another.
     * Accept optional roundBy param which is default to 1
     */
    public convert(value: number, from: string, to: string, roundBy = 1): IConvertedData {
        const fromOption: IConverterOption | undefined = this.optionsMap.get(from);
        const toOption: IConverterOption | undefined = this.optionsMap.get(to);
        if (!fromOption || !toOption) {
            throw new Error(`Provided from -> to identifiers are missing. Provided: ${from} -> ${to}`);
        }
        const relation: number = fromOption.value / toOption.value;
        const resultValue: number = value * relation;
        return {
            id: toOption.id,
            value: resultValue,
            translateKey: toOption.translateKey,
            roundedValue: Number(resultValue.toFixed(roundBy)),
            isBaseMeasurement: toOption.id === this.baseMeasurement
        };
    }

    /**
     * Converts provided value to the best format for displaying
     */
    public convertToShortened(value: number, roundBy = 1, measurement: string = this.baseMeasurement): IConvertedData {
        const currentOption: IConverterOption | undefined = this.optionsMap.get(measurement);
        if (!currentOption) {
            throw new Error(`Provided measurement "${measurement}" is missing`);
        }
        const bestOption: string = this.findBestMeasurement(Math.abs(value), currentOption);
        return this.convert(value, measurement, bestOption, roundBy);
    }

    /**
     * Goes over all options and finds the best option to display provided value.
     * Starts from provided measurement which defaults to baseMeasurement
     */
    private findBestMeasurement(value: number, measurement: IConverterOption): string {
        return this.optionsArray.reduce((resultMeasurement: string, { id }: IConverterOption) => {
            const resultValue: number =
                resultMeasurement === measurement.id
                    ? value
                    : this.convert(value, measurement.id, resultMeasurement).value;
            const possibleValue: number = this.convert(resultValue, resultMeasurement, id).value;
            return (possibleValue < resultValue && possibleValue >= 1) ||
                (possibleValue > resultValue && resultValue < 1)
                ? id
                : resultMeasurement;
        }, measurement.id);
    }

    private setOptionsMap(): void {
        const preparedOptions: [string, IConverterOption][] = this.optionsArray.map((option) => [
            option.id,
            option
        ]);
        this.optionsMap = new Map(preparedOptions);
    }
}
