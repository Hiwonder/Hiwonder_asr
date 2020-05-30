/*
 lobotsr package
*/
//% weight=10 icon="\uf013" color=#2896ff
namespace hiwonder_asr {
	
    const ASR_I2C_ADDR = 0x79;

    const ASR_RESULT_ADDR = 100;
    const ASR_WORDS_ERASE_ADDR = 101;
    const ASR_MODE_ADDR = 102;
    const ASR_ADD_WORDS_ADDR = 160;

    export enum ASRMode {
        //% block="Continuous recognition"
        mode1 = 0x01,
        //% block="Voice"
        mode2 = 0x02,
        //% block="Key"
        mode3 = 0x03
    }
	
    function II2Cread(reg: number): Buffer {
        let val = pins.i2cReadBuffer(reg, 1);
        return val;
    }

    function WireWriteByte(addr: number, val: number): boolean {
        let buf = pins.createBuffer(1);
        buf[0] = val;
        let rvalue = pins.i2cWriteBuffer(addr, buf);
        if (rvalue != 0) {
            return false;
        }
        return true;
    }	

    function WireWriteDataArray(addr: number, reg: number, val: number): boolean {
        let buf = pins.createBuffer(3);
        buf[0] = reg;
        buf[1] = val & 0xff;
        buf[2] = (val >> 8) & 0xff;
        let rvalue = pins.i2cWriteBuffer(addr, buf);
        if (rvalue != 0) {
            return false;
        }
        return true;
    }
	
    function WireReadDataArray(addr: number, reg: number, len: number): number {
        if (!WireWriteByte(addr, reg)) {
            return -1;
        }

        let buf = II2Cread(addr);
        if (buf.length != 1) {
            return 0;
        }
        return buf[0];
    }

    //% weight=96 blockId=ASRSETMODE block="Set to |%mode mode (P19:SCL,P20:SDA)"
    export function ASRSETMODE(mode: ASRMode) {
        WireWriteDataArray(ASR_I2C_ADDR, ASR_MODE_ADDR, mode);
    }

    //% weight=94 blockId=ASRREAD block="Read Data"
    export function ASRREAD(): number {
        let val = WireReadDataArray(ASR_I2C_ADDR, ASR_RESULT_ADDR, 1);
        return val;
    }

    /**
     * @param idNum is a number, eg: 1
     * @param words is text, eg: "ni hao"
     */
    //% weight=92 blockId=ASRAddWords block="Add idNum|%idNum words|%words"
    export function ASRAddWords(idNum: number, words: string) {
        let buf = pins.createBuffer(words.length + 2);
        buf[0] = ASR_ADD_WORDS_ADDR;
        buf[1] = idNum;
        for (let i = 0; i < words.length; i++) {
            buf[2 + i] = words.charCodeAt(i);
        }
        pins.i2cWriteBuffer(ASR_I2C_ADDR, buf);
        basic.pause(50);
    }

    //% weight=90 blockId=ASRWORDSERASE blockGap=50 block="Erase Data"
    export function ASRWORDSERASE() {
        WireWriteDataArray(ASR_I2C_ADDR, ASR_WORDS_ERASE_ADDR, null);
	    basic.pause(60);
    }
	
    const MP3_I2C_ADDR = 0x7B;
    const MP3_PLAY_NUM_ADDR = 1;
    const MP3_PLAY_ADDR = 5;
    const MP3_PAUSE_ADDR = 6;
    const MP3_PREV_ADDR = 8;
    const MP3_NEXT_ADDR = 9;
    const MP3_VOL_VALUE_ADDR = 12;
    const MP3_SINGLE_LOOP_ON_ADDR = 13;
    const MP3_SINGLE_LOOP_OFF_ADDR = 14;

    export enum mp3button {
        //% block="PLAY"
        PLAY = MP3_PLAY_ADDR,
        //% block="PAUSE"
        PAUSE = MP3_PAUSE_ADDR,
        //% block="PREV"
        PREV = MP3_PREV_ADDR,
        //% block="NEXT"
        NEXT = MP3_NEXT_ADDR
    }

    export enum mp3Loop {
        //% block="ON"
        ON = MP3_SINGLE_LOOP_ON_ADDR,
        //% block="OFF"
        OFF = MP3_SINGLE_LOOP_OFF_ADDR
    }

    //% weight=88 blockId=MP3_BUTTON block="MP3 |%button music (P19:SCL,P20:SDA)"
    export function MP3_BUTTON(button: mp3button) {
        WireWriteDataArray(MP3_I2C_ADDR, button, null);
        basic.pause(20);
    }

    /**
     * @param value is a number, eg: 20
     */
    //% weight=86 blockId=MP3_VOL block="MP3 VOL |%value"
    export function MP3_VOL(value: number) {
        WireWriteDataArray(MP3_I2C_ADDR, MP3_VOL_VALUE_ADDR, value);
        basic.pause(20);
    }


    //% weight=84 blockId=MP3_SINGLE_LOOP block="MP3 SINGLE LOOP |%state"
    export function MP3_SINGLE_LOOP(state: mp3Loop) {
        WireWriteDataArray(MP3_I2C_ADDR, state, null);
        basic.pause(20);
    }

    /**
     * @param num is a number, eg: 1
     */
    //% weight=82 blockId=MP3_PLAY_NUM block="MP3 PLAY NUM|%num"
    export function MP3_PLAY_NUM(num: number) {
        WireWriteDataArray(MP3_I2C_ADDR, MP3_PLAY_NUM_ADDR, num);
        basic.pause(20);
    }
}
