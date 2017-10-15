$(() => {
  const currencyCodeToSymbol = {
    AED: 'د.إ',
    AFN: '؋',
    ALL: 'L',
    AMD: '֏',
    ANG: 'ƒ',
    AOA: 'Kz',
    ARS: '$',
    AUD: '$',
    AWG: 'ƒ',
    AZN: 'ман',
    BAM: 'KM',
    BBD: '$',
    BDT: '৳',
    BGN: 'лв',
    BHD: '.د.ب',
    BIF: 'FBu',
    BMD: '$',
    BND: '$',
    BOB: '$b',
    BRL: 'R$',
    BSD: '$',
    BTC: '฿',
    BTN: 'Nu.',
    BWP: 'P',
    BYR: 'p.',
    BZD: 'BZ$',
    CAD: '$',
    CDF: 'FC',
    CHF: 'CHF',
    CLP: '$',
    CNY: '¥',
    COP: '$',
    CRC: '₡',
    CUC: '$',
    CUP: '₱',
    CVE: '$',
    CZK: 'Kč',
    DJF: 'Fdj',
    DKK: 'kr',
    DOP: 'RD$',
    DZD: 'دج',
    EEK: 'kr',
    EGP: '£',
    ERN: 'Nfk',
    ETB: 'Br',
    ETH: 'Ξ',
    EUR: '€',
    FJD: '$',
    FKP: '£',
    GBP: '£',
    GEL: '₾',
    GGP: '£',
    GHC: '₵',
    GHS: 'GH₵',
    GIP: '£',
    GMD: 'D',
    GNF: 'FG',
    GTQ: 'Q',
    GYD: '$',
    HKD: '$',
    HNL: 'L',
    HRK: 'kn',
    HTG: 'G',
    HUF: 'Ft',
    IDR: 'Rp',
    ILS: '₪',
    IMP: '£',
    INR: '₹',
    IQD: 'ع.د',
    IRR: '﷼',
    ISK: 'kr',
    JEP: '£',
    JMD: 'J$',
    JOD: 'JD',
    JPY: '¥',
    KES: 'KSh',
    KGS: 'лв',
    KHR: '៛',
    KMF: 'CF',
    KPW: '₩',
    KRW: '₩',
    KWD: 'KD',
    KYD: '$',
    KZT: 'лв',
    LAK: '₭',
    LBP: '£',
    LKR: '₨',
    LRD: '$',
    LSL: 'M',
    LTC: 'Ł',
    LTL: 'Lt',
    LVL: 'Ls',
    LYD: 'LD',
    MAD: 'MAD',
    MDL: 'lei',
    MGA: 'Ar',
    MKD: 'ден',
    MMK: 'K',
    MNT: '₮',
    MOP: 'MOP$',
    MUR: '₨',
    MVR: 'Rf',
    MWK: 'MK',
    MXN: '$',
    MYR: 'RM',
    MZN: 'MT',
    NAD: '$',
    NGN: '₦',
    NIO: 'C$',
    NOK: 'kr',
    NPR: '₨',
    NZD: '$',
    OMR: '﷼',
    PAB: 'B/.',
    PEN: 'S/.',
    PGK: 'K',
    PHP: '₱',
    PKR: '₨',
    PLN: 'zł',
    PYG: 'Gs',
    QAR: '﷼',
    RMB: '￥',
    RON: 'lei',
    RSD: 'Дин.',
    RUB: '₽',
    RWF: 'R₣',
    SAR: '﷼',
    SBD: '$',
    SCR: '₨',
    SDG: 'ج.س.',
    SEK: 'kr',
    SGD: '$',
    SHP: '£',
    SLL: 'Le',
    SOS: 'S',
    SRD: '$',
    SSP: '£',
    STD: 'Db',
    SVC: '$',
    SYP: '£',
    SZL: 'E',
    THB: '฿',
    TJS: 'SM',
    TMT: 'T',
    TND: 'د.ت',
    TOP: 'T$',
    TRL: '₤',
    TRY: '₺',
    TTD: 'TT$',
    TVD: '$',
    TWD: 'NT$',
    TZS: 'TSh',
    UAH: '₴',
    UGX: 'USh',
    USD: '$',
    UYU: '$U',
    UZS: 'лв',
    VEF: 'Bs',
    VND: '₫',
    VUV: 'VT',
    WST: 'WS$',
    XAF: 'FCFA',
    XBT: 'Ƀ',
    XCD: '$',
    XOF: 'CFA',
    XPF: '₣',
    YER: '﷼',
    ZAR: 'R',
    ZWD: 'Z$',
  };
  const pricingData = [];
  let rates = {};

  const $region = $('#region-select');
  const $type = $('#type-select');
  const $size = $('#size-select');
  const $currency = $('#currency-select');
  const $data = $('#pricing-data');
  let sortOrder = '';
  let sortField = '';

  function loadData(data) {
    data.config.regions.forEach((region) => {
      region.instanceTypes.forEach((instanceType) => {
        instanceType.sizes.forEach((size) => {
          pricingData.push({
            region: region.region,
            type: instanceType.type,
            size: size.size,
            price: size.valueColumns[0].prices.USD,
          });
        });
      });
    });
  }

  function render(values) {
    values.region.forEach((region) => {
      $region.append(`<option  value="${region}">${region}</option>`);
    });
    values.type.forEach((type) => {
      $type.append(`<option  value="${type}">${type}</option>`);
    });
    values.size.forEach((size) => {
      $size.append(`<option  value="${size}">${size}</option>`);
    });
  }

  function createFilter() {
    const where = {};
    if ($region.val() !== 'all') {
      where.region = $region.val();
    }
    if ($type.val() !== 'all') {
      where.type = $type.val();
    }
    if ($size.val() !== 'all') {
      where.size = $size.val();
    }
    return where;
  }

  function mapCodeToSymbol(code) {
    if (!Object.prototype.hasOwnProperty.call(currencyCodeToSymbol, code)) {
      return '';
    }
    return currencyCodeToSymbol[code];
  }

  function unique(data, columns) {
    const values = {};
    columns.forEach((column) => {
      values[column] = new Set();
    });
    data.forEach((record) => {
      columns.forEach((column) => {
        values[column].add(record[column]);
      });
    });
    return values;
  }

  function filter(data, where) {
    return data.filter((value) => {
      let pass = true;
      const condition = Object.keys(where);
      condition.forEach((col) => {
        pass = pass && where[col] === value[col];
      });
      return pass;
    });
  }

  function sortRows(field, isAsc) {
    const $rows = $data.children('tr');

    $rows.sort(function(a, b) {
      let prevVal = $(a).data(field);
      let nextVal = $(b).data(field);

      if (field === 'price') {
        if (prevVal === 'N/A*' || nextVal === 'prevVal') return 1;
        if (isAsc) return prevVal - nextVal;
        return nextVal - prevVal;
      }

      if (isAsc) return prevVal.localeCompare(nextVal)
      return nextVal.localeCompare(prevVal);
    });

    $data.append($rows);
  }

  function callback(data) {
    loadData(data);
    const uniqueValues = unique(pricingData, ['region', 'type', 'size']);
    render(uniqueValues);

    $('#table-headers th > a').on('click', function() {
      const where = createFilter();
      const records = filter(pricingData, where);
      const field = $(this).data('field');
      const icon = $(this).find('span');
      const isAsc = icon.hasClass('glyphicon-sort') || icon.hasClass('glyphicon-sort-by-attributes-alt');

      sortRows(field, isAsc);

      icon.removeClass('glyphicon-sort')
        .removeClass(!isAsc ? 'glyphicon-sort-by-attributes' : 'glyphicon-sort-by-attributes-alt')
        .addClass(isAsc ? 'glyphicon-sort-by-attributes' : 'glyphicon-sort-by-attributes-alt');

      $(this).siblings()
        .find('span')
        .not(this)
        .removeClass('glyphicon-sort-by-attributes')
        .removeClass('glyphicon-sort-by-attributes-alt')
        .addClass('glyphicon-sort');

      sortField = field;
      sortOrder = isAsc;
    });


    $('.data-filter').on('change', () => {
      $data.empty();
      const where = createFilter();
      const records = filter(pricingData, where);
      const factor = $currency.val() === 'USD' ? 1 : rates[$currency.val()];

      records.forEach((record) => {
        const price = parseFloat(record.price) * factor;
        $data.append(`<tr data-region=${record.region} data-type=${record.type} data-size=${record.size} data-price=${record.price}><td>${record.region}</td><td>${record.type}</td><td>${record.size}</td><td>${mapCodeToSymbol($currency.val())}${price.toFixed(4)}</td></tr>`);
      });

      if (sortField && sortOrder) sortRows(sortField, sortOrder)
    });
  }

  // export functions to global
  window.callback = callback;
  // load ec2 pricing data
  $.get('https://api.fixer.io/latest?base=USD', (data) => {
    rates = data.rates; // eslint-disable-line
    Object.keys(data.rates).forEach((currency) => {
      $currency.append(`<option  value="${currency}">${currency}</option>`);
    });
  });
  $.getScript('https://spot-price.s3.amazonaws.com/spot.js');
});
