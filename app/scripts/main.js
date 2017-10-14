$(function () {
  let pricingData = [];
  let currencies = ['USD'];
  let rates = {};

  let $region = $('#region-select');
  let $type = $('#type-select');
  let $size = $('#size-select');
  let $currency = $('#currency-select');

  let loadData = function (data) {
    for (let region of data.config.regions) {
      for (let instanceType of region.instanceTypes) {
        for (let size of instanceType.sizes) {
          pricingData.push({
            region: region.region,
            type: instanceType.type,
            size: size.size,
            price: size.valueColumns[0].prices.USD
          });
        }
      }
    }
  };

  let render = function (values, crrncs) {
    for (let region of values['region']) {
      $region.append('<option  value="' + region + '">' + region + '</option>');
    }
    for (let type of values['type']) {
      $type.append('<option  value="' + type + '">' + type + '</option>');
    }
    for (let size of values['size']) {
      $size.append('<option  value="' + size + '">' + size + '</option>');
    }
    for (let crrncy of crrncs) {
      $currency.append('<option  value="' + crrncy + '">' + crrncy + '</option>');
    }
  };

  let createFilter = function () {
    let where = {};
    if ($region.val() != 'all') {
      where['region'] = $region.val();
    }
    if ($type.val() != 'all') {
      where['type'] = $type.val();
    }
    if ($size.val() != 'all') {
      where['size'] = $size.val();
    }
    return where;
  };

  let mapCodeToSymbol = function (code) {
    if (!currencyCodeToSymbol.hasOwnProperty(code)) return undefined
    return currencyCodeToSymbol[code]
  };

  window.callback = function (data) {
    loadData(data);
    let uniqueValues = unique(pricingData, ['region', 'type', 'size']);
    render(uniqueValues, currencies);

    let $data = $('#pricing-data');
    $('select').on('change', function () {
      $data.empty();
      let where = createFilter();
      let records = filter(pricingData, where);
      let factor = 0;
      $currency.val() === 'USD' ? factor = 1 : factor = rates[$currency.val()]
      for (let record of records) {
        let price = parseFloat(record.price) * factor
        $data.append('<tr><td>' + record.region + '</td><td>' + record.type + '</td><td>' + record.size + '</td><td>' + mapCodeToSymbol($currency.val()) + price.toFixed(4) + '</td></tr>');
      }
    });
  };

  let unique = function (data, columns) {
    let values = {};
    for (let column of columns) {
      values[column] = new Set();
    }
    for (let record of data) {
      for (let column of columns) {
        values[column].add(record[column]);
      }
    }
    return values;
  };

  let filter = function (data, where) {
    return data.filter(function (value) {
      let pass = true;
      for (let col in where) {
        pass = pass && where[col] === value[col];
      }

      return pass;
    })
  };
  //load ec2 pricing data
  $.get( 'https://api.fixer.io/latest?base=USD', function( data ) {
    rates = data.rates;
    currencies = Object.keys(rates);
  }).always(function() {
    $.getScript('https://spot-price.s3.amazonaws.com/spot.js');
  });
  let currencyCodeToSymbol = {
    'AED': 'د.إ',
    'AFN': '؋',
    'ALL': 'L',
    'AMD': '֏',
    'ANG': 'ƒ',
    'AOA': 'Kz',
    'ARS': '$',
    'AUD': '$',
    'AWG': 'ƒ',
    'AZN': 'ман',
    'BAM': 'KM',
    'BBD': '$',
    'BDT': '৳',
    'BGN': 'лв',
    'BHD': '.د.ب',
    'BIF': 'FBu',
    'BMD': '$',
    'BND': '$',
    'BOB': '$b',
    'BRL': 'R$',
    'BSD': '$',
    'BTC': '฿',
    'BTN': 'Nu.',
    'BWP': 'P',
    'BYR': 'p.',
    'BZD': 'BZ$',
    'CAD': '$',
    'CDF': 'FC',
    'CHF': 'CHF',
    'CLP': '$',
    'CNY': '¥',
    'COP': '$',
    'CRC': '₡',
    'CUC': '$',
    'CUP': '₱',
    'CVE': '$',
    'CZK': 'Kč',
    'DJF': 'Fdj',
    'DKK': 'kr',
    'DOP': 'RD$',
    'DZD': 'دج',
    'EEK': 'kr',
    'EGP': '£',
    'ERN': 'Nfk',
    'ETB': 'Br',
    'ETH': 'Ξ',
    'EUR': '€',
    'FJD': '$',
    'FKP': '£',
    'GBP': '£',
    'GEL': '₾',
    'GGP': '£',
    'GHC': '₵',
    'GHS': 'GH₵',
    'GIP': '£',
    'GMD': 'D',
    'GNF': 'FG',
    'GTQ': 'Q',
    'GYD': '$',
    'HKD': '$',
    'HNL': 'L',
    'HRK': 'kn',
    'HTG': 'G',
    'HUF': 'Ft',
    'IDR': 'Rp',
    'ILS': '₪',
    'IMP': '£',
    'INR': '₹',
    'IQD': 'ع.د',
    'IRR': '﷼',
    'ISK': 'kr',
    'JEP': '£',
    'JMD': 'J$',
    'JOD': 'JD',
    'JPY': '¥',
    'KES': 'KSh',
    'KGS': 'лв',
    'KHR': '៛',
    'KMF': 'CF',
    'KPW': '₩',
    'KRW': '₩',
    'KWD': 'KD',
    'KYD': '$',
    'KZT': 'лв',
    'LAK': '₭',
    'LBP': '£',
    'LKR': '₨',
    'LRD': '$',
    'LSL': 'M',
    'LTC': 'Ł',
    'LTL': 'Lt',
    'LVL': 'Ls',
    'LYD': 'LD',
    'MAD': 'MAD',
    'MDL': 'lei',
    'MGA': 'Ar',
    'MKD': 'ден',
    'MMK': 'K',
    'MNT': '₮',
    'MOP': 'MOP$',
    'MUR': '₨',
    'MVR': 'Rf',
    'MWK': 'MK',
    'MXN': '$',
    'MYR': 'RM',
    'MZN': 'MT',
    'NAD': '$',
    'NGN': '₦',
    'NIO': 'C$',
    'NOK': 'kr',
    'NPR': '₨',
    'NZD': '$',
    'OMR': '﷼',
    'PAB': 'B/.',
    'PEN': 'S/.',
    'PGK': 'K',
    'PHP': '₱',
    'PKR': '₨',
    'PLN': 'zł',
    'PYG': 'Gs',
    'QAR': '﷼',
    'RMB': '￥',
    'RON': 'lei',
    'RSD': 'Дин.',
    'RUB': '₽',
    'RWF': 'R₣',
    'SAR': '﷼',
    'SBD': '$',
    'SCR': '₨',
    'SDG': 'ج.س.',
    'SEK': 'kr',
    'SGD': '$',
    'SHP': '£',
    'SLL': 'Le',
    'SOS': 'S',
    'SRD': '$',
    'SSP': '£',
    'STD': 'Db',
    'SVC': '$',
    'SYP': '£',
    'SZL': 'E',
    'THB': '฿',
    'TJS': 'SM',
    'TMT': 'T',
    'TND': 'د.ت',
    'TOP': 'T$',
    'TRL': '₤',
    'TRY': '₺',
    'TTD': 'TT$',
    'TVD': '$',
    'TWD': 'NT$',
    'TZS': 'TSh',
    'UAH': '₴',
    'UGX': 'USh',
    'USD': '$',
    'UYU': '$U',
    'UZS': 'лв',
    'VEF': 'Bs',
    'VND': '₫',
    'VUV': 'VT',
    'WST': 'WS$',
    'XAF': 'FCFA',
    'XBT': 'Ƀ',
    'XCD': '$',
    'XOF': 'CFA',
    'XPF': '₣',
    'YER': '﷼',
    'ZAR': 'R',
    'ZWD': 'Z$'
  }
});
