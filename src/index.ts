import { Converter, IConverterOption } from './converter.class';

/**
 * Converters. Usage example
 *
 * NumberConverter.convertToShortened(15349) --> { value: 15.349, roundedValue: 15.3, translateKey: 'KILO', ... }
 * NumberConverter.convertToShortened(0.000006785) --> { value: 6.785, roundedValue: 6.8, translateKey: 'MICRO', ... }
 *
 * NumberConverter.convert(5.5, KILO, MILLI) --> { value: 5500000, roundedValue: 5500000, translateKey: 'MILLI', ... }
 */

// <--------- Number Converter ----------->

export const GIGA: 'giga' = 'giga';
export const MEGA: 'mega' = 'mega';
export const KILO: 'kilo' = 'kilo';
export const NUMBER: 'number' = 'number';
export const MILLI: 'milli' = 'milli';
export const MICRO: 'micro' = 'micro';
export const NANO: 'nano' = 'nano';

const NumberOptions: IConverterOption[] = [
    { id: GIGA, translateKey: 'GIGA', value: 1000000000 },
    { id: MEGA, translateKey: 'MEGA', value: 1000000 },
    { id: KILO, translateKey: 'KILO', value: 1000 },
    { id: NUMBER, translateKey: '', value: 1 },
    { id: MILLI, translateKey: 'MILLI', value: 0.001 },
    { id: MICRO, translateKey: 'MICRO', value: 0.000001 },
    { id: NANO, translateKey: 'NANO', value: 0.000000001 }
];

export const FullNumberConverter = new Converter([...NumberOptions]);
export const NumberConverter = new Converter(NumberOptions.slice(2));
export const NumberConverterLite = new Converter(NumberOptions.slice(2, 4));

// <--------- Time Converter ----------->

export const NANOSECOND: 'nanosecond' = 'nanosecond';
export const MICROSECOND: 'microsecond' = 'microsecond';
export const MILLISECOND: 'millisecond' = 'millisecond';
export const SECOND: 'second' = 'second';
export const MINUTE: 'minute' = 'minute';
export const HOUR: 'hour' = 'hour';
export const DAY: 'day' = 'day';

const TimeOptions: IConverterOption[] = [
    { id: NANOSECOND, translateKey: 'NS', value: 0.000001 },
    { id: MICROSECOND, translateKey: 'MICRS', value: 0.001 },
    { id: MILLISECOND, translateKey: 'MILLS', value: 1 },
    { id: SECOND, translateKey: 'SEC', value: 1000 },
    { id: MINUTE, translateKey: 'MIN', value: 60 * 1000 },
    { id: HOUR, translateKey: 'HOUR', value: 60 * 60 * 1000 },
    { id: DAY, translateKey: 'DAY', value: 24 * 60 * 60 * 1000 }
];

export const TimeConverter = new Converter(TimeOptions);
TimeConverter.setBaseOption(NANOSECOND);
