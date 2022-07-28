export function GenerateImGuiReferences() {
    return function _GenerateImGuiReferences<T extends { new(...args: any[]): {} }>(constr: T) {
        return class extends constr {
            constructor(...args: any[]) {
                const p = constr.prototype;
                super(...args)
                Object.setPrototypeOf(this, p);
                let ref_string = "__ref_"
                console.log(this);
                console.log(Object.keys(this));
                Object.keys(this).forEach((key: string) => {
                    if (key.startsWith(ref_string)) {
                        Object.defineProperty(this, key.substring(ref_string.length, key.length), {
                            get: () => {
                                return this[key][0]
                            },
                            set: (value: any) => {
                                this[key][0] = value
                            }
                        })
                    }
                });
            }
        }
    }
}