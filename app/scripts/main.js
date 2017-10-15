$(function () {
  let pricingData = [];
  let sortDescending = false;
  let $sortIcon = $('#sortIcon');
  let $region = $('#region-select');
  let $type = $('#type-select');
  let $size = $('#size-select');
  let $data = $('#pricing-data');

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

  let changeData = () => {
    $data.empty();
    let where = createFilter();
    let records = filter(pricingData, where);
    let sortedRecords = sort(records);
    for (let record of sortedRecords) {
      $data.append('<tr><td>' + record.region + '</td><td>' + record.type + '</td><td>' + record.size + '</td><td>' + record.price + '</td></tr>');
    }
  }

  window.callback = function (data) {
    loadData(data);
    let uniqueValues = unique(pricingData, ['region', 'type', 'size']);
    render(uniqueValues);
    $('select').on('change',changeData);
  };

  $sortIcon.on("click", () => {
    if(!sortDescending) {
      $sortIcon.removeClass('arrowUp');
      $sortIcon.addClass('arrowDown');
      sortDescending = true;
    } else {
      $sortIcon.removeClass('arrowDown');
      $sortIcon.addClass('arrowUp');
      sortDescending = false;
    }
    if($data.html()) {
      changeData();
    }
  })

  let sort = records => {
    let realData = [];
    let imagData = [];
    for(let record of records) {
      if(record.price != "N/A*") {
        realData.push(record);
      } else {
        imagData.push(record);
      }
    }
    if(!sortDescending) {
      realData = realData.sort((a,b) => {
        return parseFloat(a.price) - parseFloat(b.price)
      })
    } else {
      realData = realData.sort((a,b) => {
        return parseFloat(b.price) - parseFloat(a.price)
      })
    }
    let data = realData.concat(imagData);
    return data;
  }

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
