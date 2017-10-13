$(function () {
  let pricingData = [];

  let $region = $('#region-select');
  let $type = $('#type-select');
  let $size = $('#size-select');

  let loadData = function (data) {
    document.getElementById('load-bar').style.display = 'none';
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

  let render = function (values) {
    for (let region of values['region']) {
      $region.append('<option  value="' + region + '">' + region + '</option>');
    }
    for (let type of values['type']) {
      $type.append('<option  value="' + type + '">' + type + '</option>');
    }
    for (let size of values['size']) {
      $size.append('<option  value="' + size + '">' + size + '</option>');
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

  window.callback = function (data) {
    loadData(data);
    let uniqueValues = unique(pricingData, ['region', 'type', 'size']);
    render(uniqueValues);

    let $data = $('#pricing-data');
    $('select').on('change', function () {
      $data.empty();
      let where = createFilter();
      let records = filter(pricingData, where);

      for (let record of records) {
        $data.append('<tr><td>' + record.region + '</td><td>' + record.type + '</td><td>' + record.size + '</td><td>' + record.price + '</td></tr>');
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
  $.getScript('https://spot-price.s3.amazonaws.com/spot.js');
});
