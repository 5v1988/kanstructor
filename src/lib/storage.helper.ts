class ValueStorage {
    private static values = new Map();
    
    public async getValue(key: string): Promise<string>{
        return ValueStorage.values.get(key);
    }

    public async setValue(key: string, value: string){
        ValueStorage.values.set(key, value);
    }
}

export default new ValueStorage();