import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ValidatorService {
  phones: any = {
    'zh-CN': /^(\+?0?86\-?)?(1\d{10})$/,
    'zh-TW': /^(\+?886\-?|0)?9\d{8}$/,
    'en-ZA': /^(\+?27|0)\d{9}$/,
    'en-AU': /^(\+?61|0)4\d{8}$/,
    'en-HK': /^(\+?852\-?)?[569]\d{3}\-?\d{4}$/,
    'fr-FR': /^(\+?33|0)[67]\d{8}$/,
    'pt-PT': /^(\+351)?9[1236]\d{7}$/,
    'el-GR': /^(\+?30)?(69\d{8})$/,
    'en-GB': /^(\+?44|0)7\d{9}$/,
    'en-US': /^(\+?1)?[2-9]\d{2}[2-9](?!11)\d{6}$/,
    'en-ZM': /^(\+26)?09[567]\d{7}$/,
    'ru-RU': /^(\+?7|8)?9\d{9}$/,
    'nb-NO': /^(\+?47)?[49]\d{7}$/,
    'nn-NO': /^(\+?47)?[49]\d{7}$/,
    'vi-VN': /^(0|\+?84)?((1(2([0-9])|6([2-9])|88|99))|(9((?!5)[0-9])))([0-9]{7})$/,
    'en-NZ': /^(\+?64|0)2\d{7,9}$/
  };

  isPhone(value?: any, locale?: any): boolean {
    const pattern = this.phones[locale] || this.phones['zh-CN'];
    return new RegExp(pattern).test(value);
  }

  isEmail(value?: any): boolean {
    // tslint:disable-next-line:max-line-length
    return /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(
      value
    );
  }

  isPassword(value?: any): boolean {
    // 长度8-20
    if (!/^([a-zA-Z0-9~`!@#$%^&*()-_=+{}\[\]|\\:;'"]){8,20}$/.test(value)) {
      return false;
    }
    // 必须有字母
    if (!/[a-zA-Z]+/.test(value)) {
      return false;
    }
    // 必须有数字
    return /[0-9]+/.test(value);
  }

  isPositiveInteger(value?: any): boolean {
    return /^[1-9]\d*$/.test(value);
  }

  isUrl(value?: any): boolean {
    const strRegex =
      '^((https|http|ftp|rtsp|mms)?://)' +
      // tslint:disable-next-line:quotemark
      "?(([0-9a-z_!~*'().&=+$%-]+: )?[0-9a-z_!~*'().&=+$%-]+@)?" + // ftp的user@
      '(([0-9]{1,3}.){3}[0-9]{1,3}' + // IP形式的URL- 199.194.52.184
      '|' + // 允许IP和DOMAIN（域名）
      // tslint:disable-next-line:quotemark
      "([0-9a-z_!~*'()-]+.)*" + // 域名- www.
      '([0-9a-z][0-9a-z-]{0,61})?[0-9a-z].' + // 二级域名
      '[a-z]{2,6})' + // first level domain- .com or .museum
      '(:[0-9]{1,4})?' + // 端口- :80
      '((/?)|' + // a slash isn't required if there is no file name
      // tslint:disable-next-line:quotemark
      "(/[0-9a-zA-Z_!~*'().;?:@&=+$,%#-]+)+/?)$";

    return new RegExp(strRegex).test(value);
  }
}
