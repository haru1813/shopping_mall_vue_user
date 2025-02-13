export const ajax_send = function(formData, url,type){
      let return_date;
      $.ajax({
        type: type,
        url: url,
        data: formData,
        contentType: false,
        processData: false,
        async: false,
        dataType: "json",
        success: function (data) {
          console.log(data);
          return_date = data;
        },
        error: function (jqXHR, textStatus, errorThrown) {
          console.log(jqXHR.responseText);
        },
      });
      return return_date;
  };

  export const ajax_send2 = function(formData, url,type){
    let return_date;
    $.ajax({
      type: type,
      url: url,
      data: formData,
      //contentType: "multipart/mixed",
      processData: false,
      async: false,
      dataType: "json",
      success: function (data) {
        console.log(data);
        return_date = data;
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.log(jqXHR.responseText);
      },
    });
    return return_date;
};

export const ajax_send3 = function(json, url,type){
  let return_date;
  $.ajax({
    type: type,
    url: url,
    data: json,
    contentType: "application/json",
    processData: false,
    async: false,
    dataType: "json",
    success: function (data) {
      console.log(data);
      return_date = data;
    },
    error: function (jqXHR, textStatus, errorThrown) {
      console.log(jqXHR.responseText);
    },
  });
  return return_date;
};

// 테스트