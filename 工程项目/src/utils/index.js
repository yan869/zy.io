import moment from "moment";
import config from "@/http/config";

/**
 * 时间格式化
 * 将 2018-09-23T11:54:16.000+0000 格式化成 2018/09/23 11:54:16
 * @param datetime 国际化日期格式
 */
export function format(datetime, value = "YYYY-MM-DD HH:mm:ss") {
  return moment(datetime).format(value);
}
/**
 * 过滤对象
 * 拼接url查询条件
 */
export function parFilter(obj) {
  for (var o in obj) {
    if (obj[o] === "" || obj[o] === undefined || obj[o] === null) {
      delete obj[o];
    }
  }
  return obj;
}

/**
 * 图片上传地址
 */
export function fileUpload() {
  let { baseUrl } = config;
  return baseUrl + 'file/upload';
}
/**
 * 
 * 订单状态
 */
export function orderStatus() {
  let options = [
    { value: "WAITING", label: "待接单", color: "#FF9C00" },
    { value: "CANCELLED", label: "已取消", color: "#8B8F94" },
    { value: "WAIT_COMMEND", label: "待评论", color: "purple" },
    { value: "WAIT_SERVICE", label: "待服务", color: "cyan" },
    { value: "SERVICE_WAITING", label: "服务中", color: "lime" },
    { value: "WAIT_PAY", label: "待支付", color: "#FF6000" },
    { value: "FINISHED", label: "已完成", color: "#87d068" }
  ]
  return options
}

/**
 * 订单类型
 */
export function orderType() {
  return [
    { id: 0, value: "个人订单", color: "blue" },
    { id: 1, value: "商户订单", color: "magenta" },
    { id: 2, value: "企业订单", color: "gold" },
    { id: 3, value: "工程订单", color: "volcano" },
    { id: 9, value: "其他", color: "gray" },
  ]
}

/**
 * 证书审核状态
 */
export function bookStatus() {
  return [
    { id: 0, value: '待审核', code: 1, color: '#8b8f94' },
    { id: 1, value: '认证成功', code: 2, color: '#67c23a' },
    { id: -1, value: '认证失败', code: 3, color: '#f50' },
  ]
}

/**
 * 签约类型
 */
export function signStatus() {
  return [
    { id: 0, value: '签约作业员', color: 'blue' },
    { id: 1, value: '签约团队', color: 'volcano' }
  ]
}

/**
 * 提现状态
 */
export function withdrawStatus() {
  return [
    { id: 0, value: '待处理', color: '#8b8f94' },
    { id: 1, value: '已拒绝', color: '#F56C6C' },
    { id: 2, value: '已转账', color: '#67c23a' },
    { id: 3, value: '转账失败', color: '#E6A23C' }
  ]
}

/**
 * 订单类型
 */
export function selectType() {
  return [
    { id: 0, value: '经济型', color: 'blue' },
    { id: 1, value: '优享型', color: 'volcano' },

  ]
}
/**
 *评论等级
 */
export function commentRank() {
  return [
    { id: 5, value: '好评', code: 5, color: 'blue' },
    { id: 3, value: '中评', code: 3, color: 'volcano' },
    { id: 1, value: '差评', code: 1, color: 'volcano' }

  ]
}
/**
 *评论标签
 */
export function commentLabel() {
  return [
    { id: 1, value: '好评', color: 'blue' },
    { id: 2, value: '中评', color: 'volcano' },
    { id: 3, value: '差评', color: 'volcano' }

  ]
}
/**
 *评论标签状态
 */
export function commentStatus() {
  return [
    { id: 0, value: '显示', color: 'blue' },
    { id: 1, value: '禁用', color: 'volcano' },

  ]
}
/**
 *广告类型
 */
export function bannerRank() {
  return [
    { id: 0, value: '用户', color: 'blue' },
    { id: 1, value: '作业人员', color: 'volcano' },
    { id: 2, value: '通用', color: 'volcano' },


  ]
}


export function bannerStatus() {
  return [
    { id: 0, value: '启用', color: 'blue' },
    { id: 1, value: '禁用', color: 'volcano' },

  ]
}
/**
 * 审核状态
 */
export function checkStatus() {
  return [
    { id: 0, value: '待审核', color: 'blue' },
    { id: 1, value: '已通过', color: 'volcano' },
    { id: 2, value: '未通过', color: '#F56C6C' }

  ]
}
/**
 * 审核状态
 */
export function addressRange() {
  return [
    { id: 0, value: '待审核', code: 0, color: 'blue' },
    { id: 1, value: '已通过', code: 1, color: 'volcano' },
    { id: 2, value: '未通过', code: -1, color: 'volcano' }

  ]
}
/**
 * 下拉选择显示范围
 */
export function showKm() {
  return [
    { id: 0, value: '1', color: 'blue' },
    { id: 1, value: '5', color: 'volcano' },
    { id: 2, value: '10', color: 'volcano' },
    { id: 3, value: '15', color: 'blue' },
    { id: 4, value: '20', color: 'volcano' },
    { id: 5, value: '25', color: 'volcano' },
    { id: 6, value: "30", color: 'red' }

  ]
}
/**
 * 地区有效
 */
export function isValiable() {
  return [
 
    { id: 0, value: '无效', color: 'volcano' },
    { id:1, value: '有效', color: 'blue' },
  ]
}
/**
 * 结算状态
 */
export function payStatus() {
  return [
 
    { id: 0, value: '未结算', color: 'volcano' },
    { id:1, value: '已结算', color: 'blue' },
  ]
}
// 用户审核状态
export function userCheck(){
  return [
    { id: 0, value: '正常', color: '#67c23a' },
    { id:1, value: '冻结', color: '#8b8f94' },
    { id: 0, value: '删除', color: '#f50' },
  ]
}
// 用户角色
export function userRoles(){
  return [
    { id: 0, value: '系统管理员', color: '#67c23a' },
    { id:1, value: '团队管理员', color: '#8b8f94' },
  ]
}

