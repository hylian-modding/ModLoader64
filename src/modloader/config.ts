// Modloader configuration

import fs from 'fs'
import {IConfig} from '../API/IModLoaderAPI'

class configuration implements IConfig{

    data: any = {};
    file: string

    constructor(file: string){
        this.file = file
        if (fs.existsSync(file)){
            this.data = JSON.parse(fs.readFileSync(file, 'utf8'))
        }else{
            fs.writeFileSync(file, JSON.stringify(this.data, null, 2))
        }
    }

    setData(category: string, key: string, value: any){
        if (!this.data[category].hasOwnProperty(key)){
            this.data[category][key] = value
            this.save()
        }
    }

    registerConfigCategory(category: string): object{
        if (!this.data.hasOwnProperty(category)){
            this.data[category] = {}
            this.save()
        }
        return this.data[category]
    }

    save(){
        fs.writeFileSync(this.file, JSON.stringify(this.data, null, 2))
    }

}

export default configuration
