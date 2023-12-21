class ArrayUtils {
  constructor() {}

  /**
   * 对象数组分组 (不会改变原数组)
   * @param arr 原数组
   * @param by 分组依据的字段
   * @param unite 结果是否合并为一个数组(默认为 false)
   * @return Array
   */
  static groupBy(
    arr: Array<Object>,
    by: string,
    unite: boolean = false,
  ): Array<Object> {
    const arrClone = JSON.parse(JSON.stringify(arr));

    let result = [];

    let groupObj = {};

    arrClone.forEach((item) => {
      const groupExist = groupObj.hasOwnProperty(item[by]);
      if (groupExist) {
        groupObj[item[by]].push(item);
      } else {
        groupObj[item[by]] = [item];
      }
    });

    if (unite) {
      const values = Object.values(groupObj);
      values.forEach((value) => {
        console.log(value);
        result = result.concat(value);
      });
    } else {
      result.push(groupObj);
    }

    return result;
  }

  /**
   * 对象数组排序 (不会改变原数组)
   * @param arr 原数组
   * @param by 依据字段
   * @param orderBy 排序方式,DESC - 降序, ASC - 升序
   * @return Array
   */
  static sortBy = (
    arr: Array<Object>,
    by: string,
    orderBy: 'DESC' | 'ASC' = 'ASC',
  ): Array<Object> => {
    const arrClone = JSON.parse(JSON.stringify(arr));
    arrClone.sort((item, item2) => {
      if (orderBy === 'ASC') {
        return item[by] - item2[by];
      } else {
        return item2[by] - item[by];
      }
    });

    return arrClone;
  };

  /**
   * 对象数组分组并排序 (不会改变原数组)
   * @param arr 原数组
   * @param groupBy 分组依据字段
   * @param sortBy 排序依据字段
   * @param orderBy 排序方式,DESC - 降序, ASC - 升序
   */
  static groupAndSort = (
    arr: Array<Object>,
    groupBy: string,
    sortBy: string,
    orderBy: 'DESC' | 'ASC' = 'ASC',
  ) => {
    const arrClone = JSON.parse(JSON.stringify(arr));

    const groupedArr = ArrayUtils.groupBy(arrClone, groupBy);

    const subArrArr = Object.values(groupedArr[0]);

    let result = [];

    subArrArr.forEach((subArr) => {
      result = result.concat(ArrayUtils.sortBy(subArr, sortBy, orderBy));
    });

    return result;
  };

  static appendToParent(
    array: Array<any>,
    obj: Object,
    refKey: string,
    pKey: string,
  ) {
    const loop = (subArray: Array<any>, obj: Object) => {
      for (let i = 0; i < subArray.length; i++) {
        const item = subArray[i];
        if (item[pKey] === obj[refKey]) {
          item.children ? item.children.push(obj) : (item.children = [obj]);
        } else {
          if (item.children) loop(item.children, obj);
        }
      }
    };

    loop(array, obj);
  }

  static generateTree(
    array: Array<any>,
    options: {
      indexKey: string;
      rootVal: any;
      parentBy: string;
    },
  ) {
    const { indexKey, rootVal, parentBy } = options;

    let origin = JSON.parse(JSON.stringify(array)) as Array<any>;

    let tree = [];

    origin.forEach((item) => {
      if (item[indexKey] === rootVal) {
        tree.push(item);
      } else {
        ArrayUtils.appendToParent(tree, item, indexKey, parentBy);
      }
    });

    return tree;
  }
}

export default ArrayUtils;
