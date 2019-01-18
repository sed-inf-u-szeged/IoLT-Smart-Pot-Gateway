$(function(){
    $('.js-example-basic-single').select2();

    $("input[name='data_from_date']").datetimepicker({
    });

    $("input[name='data_until_date']").datetimepicker({
    });

    $("form").submit(function () {
      $("button[type='submit']").prop("disabled", true);
      return true;
    });


    $('.js-example-basic-single').on('select2:select', function (e) {
        console.log(inner_projects_array[0].Start_date);
        console.log(e.params.data.text);
        inner_projects_array.forEach(project => {
          if(project.Name == e.params.data.text){
            
            $("input[name='data_from_date']").datetimepicker('setOptions',{
              value: new Date(project.Start_date)
            });
            
            $("input[name='data_until_date']").datetimepicker('setOptions',{
              value: new Date(project.End_date)
            });

          }
        });
    });

    

  });