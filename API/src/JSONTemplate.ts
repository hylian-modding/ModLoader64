export class JSONTemplate {
  jsonFields!: string[];
  toJSON() {
      const jsonObj: any = {};
      for (let i = 0; i < this.jsonFields.length; i++) {
          let v = (this as any)[this.jsonFields[i]];
          if (v instanceof JSONTemplate) {
              jsonObj[this.jsonFields[i]] = v.toJSON();
          } else {
              jsonObj[this.jsonFields[i]] = v;
          }
      }
      return jsonObj;
  }
}
