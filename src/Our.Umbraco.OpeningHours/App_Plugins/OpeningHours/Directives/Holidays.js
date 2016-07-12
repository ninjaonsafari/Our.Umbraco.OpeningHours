﻿angular.module('umbraco.directives').directive('ohHolidays', function () {
    return {
        scope: {
            value: '=',
            config: '='
        },
        restrict: 'E',
        replace: true,
        templateUrl: '/App_Plugins/OpeningHours/Views/Directives/Holidays.html',
        link: function (scope) {

            // Ensure properties of the configuration object
            scope.config.requireHolidayDates = !!scope.config.requireHolidayDates;
            scope.config.enableSplitTimes = !!scope.config.enableSplitTimes;
            scope.config.maxSplitTimes = parseInt(scope.config.maxSplitTimes);

            // Varius properties used for the UI
            scope.times = ['00:00', '00:05', '00:10', '00:15', '00:20', '00:25', '00:30', '00:35', '00:40', '00:45', '00:50', '00:55', '01:00', '01:05', '01:10', '01:15', '01:20', '01:25', '01:30', '01:35', '01:40', '01:45', '01:50', '01:55', '02:00', '02:05', '02:10', '02:15', '02:20', '02:25', '02:30', '02:35', '02:40', '02:45', '02:50', '02:55', '03:00', '03:05', '03:10', '03:15', '03:20', '03:25', '03:30', '03:35', '03:40', '03:45', '03:50', '03:55', '04:00', '04:05', '04:10', '04:15', '04:20', '04:25', '04:30', '04:35', '04:40', '04:45', '04:50', '04:55', '05:00', '05:05', '05:10', '05:15', '05:20', '05:25', '05:30', '05:35', '05:40', '05:45', '05:50', '05:55', '06:00', '06:05', '06:10', '06:15', '06:20', '06:25', '06:30', '06:35', '06:40', '06:45', '06:50', '06:55', '07:00', '07:05', '07:10', '07:15', '07:20', '07:25', '07:30', '07:35', '07:40', '07:45', '07:50', '07:55', '08:00', '08:05', '08:10', '08:15', '08:20', '08:25', '08:30', '08:35', '08:40', '08:45', '08:50', '08:55', '09:00', '09:05', '09:10', '09:15', '09:20', '09:25', '09:30', '09:35', '09:40', '09:45', '09:50', '09:55', '10:00', '10:05', '10:10', '10:15', '10:20', '10:25', '10:30', '10:35', '10:40', '10:45', '10:50', '10:55', '11:00', '11:05', '11:10', '11:15', '11:20', '11:25', '11:30', '11:35', '11:40', '11:45', '11:50', '11:55', '12:00', '12:05', '12:10', '12:15', '12:20', '12:25', '12:30', '12:35', '12:40', '12:45', '12:50', '12:55', '13:00', '13:05', '13:10', '13:15', '13:20', '13:25', '13:30', '13:35', '13:40', '13:45', '13:50', '13:55', '14:00', '14:05', '14:10', '14:15', '14:20', '14:25', '14:30', '14:35', '14:40', '14:45', '14:50', '14:55', '15:00', '15:05', '15:10', '15:15', '15:20', '15:25', '15:30', '15:35', '15:40', '15:45', '15:50', '15:55', '16:00', '16:05', '16:10', '16:15', '16:20', '16:25', '16:30', '16:35', '16:40', '16:45', '16:50', '16:55', '17:00', '17:05', '17:10', '17:15', '17:20', '17:25', '17:30', '17:35', '17:40', '17:45', '17:50', '17:55', '18:00', '18:05', '18:10', '18:15', '18:20', '18:25', '18:30', '18:35', '18:40', '18:45', '18:50', '18:55', '19:00', '19:05', '19:10', '19:15', '19:20', '19:25', '19:30', '19:35', '19:40', '19:45', '19:50', '19:55', '20:00', '20:05', '20:10', '20:15', '20:20', '20:25', '20:30', '20:35', '20:40', '20:45', '20:50', '20:55', '21:00', '21:05', '21:10', '21:15', '21:20', '21:25', '21:30', '21:35', '21:40', '21:45', '21:50', '21:55', '22:00', '22:05', '22:10', '22:15', '22:20', '22:25', '22:30', '22:35', '22:40', '22:45', '22:50', '22:55', '23:00', '23:05', '23:10', '23:15', '23:20', '23:25', '23:30', '23:35', '23:40', '23:45', '23:50', '23:55'];

            // Function for initializing the model (AKA "value" from the directive attribute)
            function initModel() {

                // Convert legacy values (beta1 didn't support multiple times)
                if (scope.value && typeof (scope.value) == 'object') {
                    angular.forEach(scope.value, function (value, key) {
                        if (value.items == undefined) {
                            scope.value[key] = {
                                label: value.label,
                                date: value.date,
                                items: []
                            };
                            if (value.opens && value.closes && value.isOpen) {
                                scope.value[key].items.push({
                                    opens: value.opens,
                                    closes: value.closes
                                });
                            }
                        }

                        // Initialize the configuration for the date picker
                        scope.value[key].$datePicker = {
                            view: 'datepicker',
                            config: { pickDate: true, pickTime: false, pick12HourFormat: false, format: 'YYYY-MM-DD' },
                            value: value.date
                        };

                    });
                    return;
                }

                // If we reach this point, it means that the model is either valid or hasn't yet
                // been initialize (eg. when creating a new content item)
                scope.value = [];

            }

            // Appends a new day to the list of holidays
            scope.appendDay = function () {

                // Initialize a new object for the day
                var day = {
                    label: '',
                    date: '',
                    items: []
                };

                // Initialize the configuration for the date picker
                day.$datePicker = {
                    view: 'datepicker',
                    config: { pickDate: true, pickTime: false, pick12HourFormat: false, format: 'YYYY-MM-DD' },
                    value: day.date
                };

                // Watch for changes of the date picker value
                scope.$watch(function () {
                    return day.$datePicker.value;
                }, function (value) {
                    day.date = value;
                });

                // Append the day to the holidays array
                scope.value.push(day);

            };

            // Removes the day at the specified index
            scope.removeDay = function (index) {
                scope.value.splice(index, 1);
            };

            // Adds a new item to the specified day
            scope.addItem = function (day) {
                day.items.push({
                    opens: '09:00',
                    closes: '17:00'
                });
            };

            // Removes an item for day at the specified index
            scope.removeItem = function (day, index) {
                day.items.splice(index, 1);
            };

            initModel();

        }
    };
});