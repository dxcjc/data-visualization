import request from "../../utils/request";

export function test(params) {
  return request({
    url: "http/getInfo",
    method: "GET",
    params: params
  })
}