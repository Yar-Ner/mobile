
let getDate = (stringDate: string) => new Date(0, 0,0, parseInt(stringDate.split(':')[0]), parseInt(stringDate.split(':')[1]));

export const getDifferentBetweenTwoTimes = (time1: string, time2: string) => {
    return +getDate(time2) - +getDate(time2);
}