import PouchDB from 'pouchdb';

export default class DB{
    constructor(name){
        this.db = new PouchDB(name);
    }

    async getAll(){
        let allDatas = await this.db.allDocs({ include_docs: true});
        let datas = {};

        allDatas.rows.forEach(d => datas[d.id] = d.doc);

        return datas;
    }

    async getAllRows(){
        let allDatas = await this.db.allDocs({ include_docs: true});
        return allDatas.rows;
    }

    getRow(id){
        return this.db.get(id);
    }

    getData(){
        return this.db.allDocs({ include_docs: true});
    }

    async create(data){
        const res = await this.db.post({...data});
        return res;
    }

    async delete(id){
        id = ''+id;
        const res = await this.db.get(id)
        return this.db.remove(res);
    }
    
    async update(id,data){
        id = ''+id;
        const res = await this.db.get(id);
        data._id = res._id;
        data._rev = res._rev;
        return this.db.post(data);
    }
}