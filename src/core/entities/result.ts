export default class Result {
  readonly label: string;
  readonly precision: number;

  constructor(label: string, precision: number) {
    this.label = label;
    this.precision = precision;
  }
}
