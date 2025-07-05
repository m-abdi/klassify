export default class Result {
  readonly id: any;
  readonly text: string;
  readonly label: string;
  readonly precision: number;

  constructor(text: string, label: string, precision: number, id?: any) {
    this.id = id;
    this.text = text;
    this.label = label;
    this.precision = precision;
  }
}
