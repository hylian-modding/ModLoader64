"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class JSONTemplate {
    toJSON() {
        const jsonObj = {};
        for (let i = 0; i < this.jsonFields.length; i++) {
            let v = this[this.jsonFields[i]];
            if (v instanceof JSONTemplate) {
                jsonObj[this.jsonFields[i]] = v.toJSON();
            }
            else {
                jsonObj[this.jsonFields[i]] = v;
            }
        }
        return jsonObj;
    }
}
exports.JSONTemplate = JSONTemplate;
//# sourceMappingURL=JSONTemplate.js.map