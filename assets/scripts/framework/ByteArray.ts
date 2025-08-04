const MAX_SIZE: number = 2 ** 32;

const enum BaseTypeSize {
    BOOLEAN     = 1,
    BYTE        = 1,
    UBYTE       = 1,
    INT16       = 2,
    UINT16      = 2,
    INT32       = 4,
    UINT32      = 4,
    FLOAT32     = 4,
    INT64       = 8,
    UINT64      = 8,
    FLOAT64     = 8
}

export class ByteArray {
    private _littleEndian: boolean = true;
    private _capacity: number = 0;
    private _writePosition: number = 0;
    private _readPosition: number = 0;

    private _buffer: ArrayBuffer;
    private _dataView: DataView;

    constructor();
    constructor(buffer: ArrayBuffer, littleEndian?: boolean);
    constructor(capacity: number, littleEndian?: boolean);

    constructor(bufferOrCapacity?: ArrayBuffer | number, littleEndian: boolean = true) {
        this._littleEndian = littleEndian;

        if (bufferOrCapacity instanceof ArrayBuffer) {
            this._buffer = bufferOrCapacity;
            this._capacity = this._buffer.byteLength;
            this._writePosition = this._capacity;
        } else if (typeof bufferOrCapacity === "number") {
            this._capacity = bufferOrCapacity;
            this._buffer = new ArrayBuffer(this._capacity);
        } else {
            this._buffer = new ArrayBuffer(0);
        }
        
        this._dataView = new DataView(this._buffer);
    }

    public set littleEndian(value: boolean) {
        this._littleEndian = value;
    }

    public get littleEndian(): boolean {
        return this._littleEndian;
    }

    public get capacity() {
        return this._capacity;
    }

    /**
     * 写入时自动扩容处理，1.5倍自动增长
     * @param writeSize 写入的长度
     */
    private checkCapacity(writeSize: number) {
        if (this._writePosition + writeSize > this._capacity) {
            this.reallocate(this._writePosition + writeSize);

            const oldUint8Array: Uint8Array = new Uint8Array(this._buffer);

            this._buffer = new ArrayBuffer(this._capacity);
            this._dataView = new DataView(this._buffer);

            const newUint8Array: Uint8Array = new Uint8Array(this._buffer);
            newUint8Array.set(oldUint8Array);
        }
    }

    private reallocate(newCapacity: number) {
        if (this._capacity > MAX_SIZE - this._capacity / 2) {
            this._capacity = MAX_SIZE;
        } else {
            let growth: number = Math.floor(this._capacity + this._capacity / 2);
            this._capacity = growth > newCapacity ? growth : newCapacity;
        }
    }

    private isReadable(readSize: number): boolean {
        return this._writePosition - this._readPosition >= readSize;
    }

    /**
     * 
     * @param value 
     */
    public writeBoolean(value: boolean) {
        this.writeUByte(+value);
    }

    public readBoolean(): Boolean {
        if (this.isReadable(BaseTypeSize.BOOLEAN)) {
            return this._dataView.getUint8(this._readPosition++) !== 0;
        }
        return false;
    }

    /**
     * 
     * @param value 
     */
    public writeByte(value: number) {
        this.checkCapacity(BaseTypeSize.BYTE);
        this._dataView.setInt8(this._writePosition++, value);
    }

    public readByte(): number {
        if (this.isReadable(BaseTypeSize.BYTE)) {
            return this._dataView.getInt8(this._readPosition++);
        }
        return 0;
    }

    /**
     * 
     * @param value 
     */
    public writeUByte(value: number) {
        this.checkCapacity(BaseTypeSize.UBYTE);
        this._dataView.setUint8(this._writePosition++, value);
    }

    public readUByte(): number {
        if (this.isReadable(BaseTypeSize.UBYTE)) {
            return this._dataView.getUint8(this._readPosition++);
        }
        return 0;
    }

    /**
     * 
     * @param value 
     */
    public writeInt16(value: number) {
        this.checkCapacity(BaseTypeSize.INT16);
        this._dataView.setInt16(this._writePosition, value, this._littleEndian);
        this._writePosition += BaseTypeSize.INT16;
    }

    public readInt16(): number {
        let res: number = 0;
        if (this.isReadable(BaseTypeSize.INT16)) {
            res = this._dataView.getInt16(this._readPosition, this._littleEndian);
            this._readPosition += BaseTypeSize.INT16;
        }
        return res;
    }
    
    /**
     * 
     * @param value 
     */
    public writeUInt16(value: number) {
        this.checkCapacity(BaseTypeSize.UINT16);
        this._dataView.setUint16(this._writePosition, value, this._littleEndian);
        this._writePosition += BaseTypeSize.UINT16;
    }

    public readUInt16(): number {
        let res: number = 0;
        if (this.isReadable(BaseTypeSize.UINT16)) {
            res = this._dataView.getUint16(this._readPosition, this._littleEndian);
            this._readPosition += BaseTypeSize.UINT16;
        }
        return res;
    }

    /**
     * 
     * @param value 
     */
    public writeInt32(value: number) {
        this.checkCapacity(BaseTypeSize.INT32);
        this._dataView.setInt32(this._writePosition, value, this._littleEndian);
        this._writePosition += BaseTypeSize.INT32;
    }

    public readInt32(): number {
        let res: number = 0;
        if (this.isReadable(BaseTypeSize.INT32)) {
            res = this._dataView.getInt32(this._readPosition, this._littleEndian);
            this._readPosition += BaseTypeSize.INT32;
        }
        return res;
    }

    /**
     * 
     * @param value 
     */
    public writeUInt32(value: number) {
        this.checkCapacity(BaseTypeSize.UINT32);
        this._dataView.setUint32(this._writePosition, value, this._littleEndian);
        this._writePosition += BaseTypeSize.INT32;
    }

    public readUInt32(): number {
        let res: number = 0;
        if (this.isReadable(BaseTypeSize.UINT32)) {
            res = this._dataView.getUint32(this._readPosition, this._littleEndian);
            this._readPosition += BaseTypeSize.UINT32;
        }
        return res;
    }

    /**
     * 
     * @param value 
     */
    public writeFloat32(value: number) {
        this.checkCapacity(BaseTypeSize.FLOAT32);
        this._dataView.setFloat32(this._writePosition, value, this._littleEndian);
        this._writePosition += BaseTypeSize.FLOAT32;
    }

    public readFloat32(): number {
        let res: number = 0;
        if (this.isReadable(BaseTypeSize.FLOAT32)) {
            res = this._dataView.getFloat32(this._readPosition, this._littleEndian);
            this._readPosition += BaseTypeSize.FLOAT32;
        }
        return res;
    }

    /**
     * 
     * @param value 
     */
    public writeInt64(value: number) {
        this.checkCapacity(BaseTypeSize.INT64);
        this._dataView.setBigInt64(this._writePosition, BigInt(value), this._littleEndian);
        this._writePosition += BaseTypeSize.INT64;
    }

    public readInt64(value: number) {
        let res: number = 0;
        if (this.isReadable(BaseTypeSize.INT64)) {
            res = Number(this._dataView.getBigInt64(this._readPosition, this._littleEndian));
            this._readPosition += BaseTypeSize.INT64;
        }
        return res;
    }

    /**
     * 
     * @param value 
     */
    public writeUInt64(value: number) {
        this.checkCapacity(BaseTypeSize.UINT64);
        this._dataView.setBigUint64(this._writePosition, BigInt(value), this._littleEndian);
        this._writePosition += BaseTypeSize.UINT64;
    }

    public readUInt64(): number {
        let res: number = 0;
        if (this.isReadable(BaseTypeSize.UINT64)) {
            res = Number(this._dataView.getBigUint64(this._readPosition, this._littleEndian));
            this._readPosition += BaseTypeSize.UINT64;
        }
        return res;
    }

    /**
     * 
     * @param value 
     */
    public writeFloat64(value: number) {
        this.checkCapacity(BaseTypeSize.FLOAT64);
        this._dataView.setFloat64(this._writePosition, value, this._littleEndian);
        this._writePosition += BaseTypeSize.FLOAT64;
    }

    public readFloat64(): number {
        let res: number = 0;
        if (this.isReadable(BaseTypeSize.FLOAT64)) {
            res = this._dataView.getFloat64(this._readPosition, this._littleEndian);
            this._readPosition += BaseTypeSize.FLOAT64;
        }
        return res;
    }

    /**
     * 
     * @param str 
     */
    public writeString(str: string) {
        const uint8Array: Uint8Array = new TextEncoder().encode(str);
        this.checkCapacity(uint8Array.length);

        const oldUint8Array: Uint8Array = new Uint8Array(this._buffer);
        oldUint8Array.set(uint8Array, this._writePosition);
        this._writePosition += uint8Array.length;
    }

    public readString(length: number) {
        let res: string = "";
        if (this.isReadable(length)) {
            res = new TextDecoder("utf-8").decode(this._buffer.slice(this._readPosition, this._readPosition + length));
            this._readPosition += length;
        }
        return res;
    }

    public get buffer(): ArrayBuffer {
        return this._buffer.slice(this._readPosition, this._writePosition);
    }
}
