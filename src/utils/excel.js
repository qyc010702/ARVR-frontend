import   {read,utils}  from "xlsx";
//引入xlsx
/**
 * 导入excel的函数
 * @param {*} file
 */
const importsExcel=(file)=>{
    //使用promise导入
    return  new Promise((resolve,reject)=>{
        // 获取上传的文件对象
        const { files } = file.target; //获取里面的所有文件
        // 通过FileReader对象读取文件
        const fileReader = new FileReader();

        fileReader.onload = event => { //异步操作  excel文件加载完成以后触发
            try {
                const { result } = event.target;
                // 以二进制流方式读取得到整份excel表格对象
                const workbook = read(result, { type: 'binary' });
                let data = []; // 存储获取到的数据
                // 遍历每张工作表进行读取（这里默认只读取第一张表）
                for (const sheet in workbook.Sheets) {
                    if (workbook.Sheets.hasOwnProperty(sheet)) {
                        data = data.concat(utils.sheet_to_json(workbook.Sheets[sheet]));
                    }
                }
                resolve(data);//导出数据
            } catch (e) {
                // 这里可以抛出文件类型错误不正确的相关提示
                reject("失败");//导出失败
            }
        };
        // 以二进制方式打开文件
        fileReader.readAsBinaryString(files[0]);
    })

}

export  {
    importsExcel
}