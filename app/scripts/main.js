$(function() {
  const pricingData = [];

  const $data = $('#pricing-data');
  const $region = $('#region-select');
  const $type = $('#type-select');
  const $size = $('#size-select');
  let sortOrder = '';
  let sortField = '';

  const loadData = function(data) {
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

  const renderOptions = function(values) {
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

  const renderRows = function(records) {
    for (let record of records) {
      $data.append(`
        <tr data-region=${record.region} data-type=${record.type} data-size=${record.size} data-price=${record.price}>
          <td>${record.region}</td>
          <td>${record.type}</td>
          <td>${record.size}</td>
          <td>${record.price}</td>
        </tr>
      `);
    }
  }

  const createFilter = function() {
    const where = {};
    if ($region.val() !== 'all') {
      where['region'] = $region.val();
    }
    if ($type.val() !== 'all') {
      where['type'] = $type.val();
    }
    if ($size.val() !== 'all') {
      where['size'] = $size.val();
    }
    return where;
  };

  const sortRows = function(field, isAsc) {
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

  window.callback = function(data) {
    loadData(data);
    const uniqueValues = unique(pricingData, ['region', 'type', 'size']);
    renderOptions(uniqueValues);
    renderRows(pricingData);

    $('#sort th').on('click', function() {
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

    $('select').on('change', function() {
      $data.empty();
      const where = createFilter();
      const records = filter(pricingData, where);

      renderRows(records);
      sortRows(sortField, sortOrder);
    });
  };

  const unique = function(data, columns) {
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

  const filter = function(data, where) {
    return data.filter(function(value) {
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
