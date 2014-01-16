'use strict';

(function () {
    var app = angular.module('GymTrackerApp', ['ngRoute']);

    app.config([
        '$routeProvider',
        function (router) {
            router.when('/', {
                templateUrl: 'assets/html/home.html',
                controller: 'HomeCtrl',
                controllerAs: 'home'
            });

            router.when('/profile', {
                templateUrl: 'assets/html/profile.html',
                controller: 'HomeCtrl',
                controllerAs: 'home'
            });

            router.when('/exercises', {
                templateUrl: 'assets/html/exercises.html',
                controller: 'ExercisesCtrl',
                controllerAs: 'exercises'
            });

            router.when('/workouts', {
                templateUrl: 'assets/html/workouts.html',
                controller: 'WorkoutsCtrl',
                controllerAs: 'workouts'
            });

            router.when('/nutrition', {
                templateUrl: 'assets/html/nutrition.html',
                controller: 'NutritionCtrl',
                controllerAs: 'nutrition'
            });

            router.when('/meals', {
                templateUrl: 'assets/html/meals.html',
                controller: 'MealsCtrl',
                controllerAs: 'meals'
            });

            router.when('/exercise/:slug', {
                templateUrl: 'assets/html/exercise.html',
                controller: 'ExerciseCtrl',
                controllerAs: 'exercise',
                resolve: {
                    exercise: ['$route', 'exercises', function ($route, exercises) {
                        var slug = $route.current.params.slug;

                        return exercises.findBySlug(slug);
                    }]
                }
            });

            router.when('/workout/:slug', {
                templateUrl: 'assets/html/workout.html',
                controller: 'WorkoutCtrl',
                controllerAs: 'workout',
                resolve: {
                    workout: ['$route', 'workouts', function ($route, workouts) {
                        var slug = $route.current.params.slug;

                        return workouts.findBySlug(slug);
                    }]
                }
            });

            router.otherwise({
                redirectTo: '/'
            });
        }
    ]);

    app.filter(
        'has',
        [
            function () {
                return function (item, search, keys) {
                    if (!search) {
                        return true;
                    }

                    for (var i in keys) {
                        var key = keys[i];
                        var value = item[key];

                        if (value.substring) {
                            return value.indexOf(search) >= 0;
                        }

                        return value == search;
                    }

                    return false;
                }
            }
        ]
    );

    app.filter(
        'hasExercise',
        [
            'hasFilter',
            function (find) {
                return function (item, search) {
                    return find(item, search, ['title']);
                }
            }
        ]
    );

    app.filter(
        'findExerciseBySlug',
        [
            'exercises',
            function (exercises) {
                return function (slug) {
                    for (var i in exercises.items) {
                        if (exercises.items[i].slug == slug) {
                            return exercises.items[i];
                        }
                    }

                    return null;
                }
            }
        ]
    );

    app.service(
        'storage',
        [
            function () {
                function clean(value) {

                    if (value instanceof Object || value instanceof Array) {
                        delete value.$$hashKey;

                        for (var i in value) {
                            clean(value[i]);
                        }
                    }
                }

                this.load = function (key, otherwise) {
                    var value = (localStorage.getItem(key) && JSON.parse(localStorage.getItem(key))) || otherwise;

                    clean(value);

                    return value;
                };

                this.save = function (key, value) {
                    localStorage.setItem(key, JSON.stringify(value));
                };

                this.clear = function () {
                    localStorage.clear();
                };
            }
        ]
    );

    app.service(
        'exercises',
        [
            'storage',
            function (storage) {
                this.items = [];

                this.addExercise = function (title, video, tags, slug) {
                    slug = slug || title.toLowerCase().replace(' ', '-');

                    var item = {
                        title: title,
                        slug: slug,
                        video: video || null,
                        tags: tags || []
                    };

                    this.items.push(item);

                    this.save();

                    return item;
                };

                this.findBySlug = function(value) {
                    for (var i in this.items) {
                        if (this.items[i].slug == value) {
                            return this.items[i];
                        }
                    }

                    return null;
                };

                this.save = function () {
                    storage.save('exercises', this.items);
                };

                this.load = function () {
                    this.items = storage.load('exercises', this.items);
                };

                this.load();
            }
        ]
    );

    app.service(
        'workouts',
        [
            'storage',
            function (storage) {
                this.items = [];

                this.addWorkout = function () {
                    var item = {
                        slug: new Date().getTime(),
                        exercises: [
                        ]
                    };

                    this.items.push(item);

                    storage.save('workouts', this.items);

                    return item;
                };

                this.findBySlug = function(value) {
                    for (var i in this.items) {
                        if (this.items[i].slug == value) {
                            return this.items[i];
                        }
                    }

                    return null;
                };

                this.save = function () {
                    storage.save('workouts', this.items);
                };

                this.load = function () {
                    this.items = storage.load('workouts', this.items);
                };

                this.load();
            }
        ]
    );

    app.controller(
        'HomeCtrl',
        [
            'storage',
            'exercises',
            'workouts',
            function (storage, exercises, workouts) {
                this.resetStorage = function () {
                    storage.clear();

                    workouts.items = [];

                    exercises.items = [];

                    exercises.addExercise('Back Squat', 'http://www.youtube.com/watch?v=2dpwZ0Vaih4', ['legs', 'lower', 'quads']);
                    exercises.addExercise('Front Squat', undefined, ['legs', 'lower', 'quads']);
                    exercises.addExercise('Leg Press', undefined, ['legs', 'lower', 'quads']);
                    exercises.addExercise('Split Squat', 'http://www.youtube.com/watch?v=r1jukGZPnZI', ['legs', 'lower', 'quads']);
                    exercises.addExercise('Lunges', 'http://www.youtube.com/watch?v=Z2n58m2i4jg', ['legs', 'lower', 'quads']);
                    exercises.addExercise('Step Ups', 'http://www.youtube.com/watch?v=dQqApCGd5Ss', ['legs', 'lower', 'quads']);
                    exercises.addExercise('Leg Extensions', undefined, ['legs', 'lower', 'quads']);

                    exercises.addExercise('Romanian Deadlift', 'http://www.youtube.com/watch?v=WtWtjViRsKo', ['legs', 'lower', 'hamstrings']);
                    exercises.addExercise('Stiff Legged Deadlift', 'http://www.youtube.com/watch?v=gtevN0SWp-o', ['legs', 'lower', 'hamstrings']);
                    exercises.addExercise('Glute-Ham Raises', 'http://www.youtube.com/watch?v=tCsyyC5E7M8', ['legs', 'lower', 'hamstrings']);
                    exercises.addExercise('Pull Thrus', 'http://www.youtube.com/watch?v=A32WSOB-6Gw', ['legs', 'lower', 'hamstrings']);
                    exercises.addExercise('Leg Curls', null, ['legs', 'lower', 'hamstrings']);
                    exercises.addExercise('Good Mornings', 'http://www.youtube.com/watch?v=Iycq-kJann0', ['legs', 'lower', 'hamstrings']);
                    exercises.addExercise('Deadlift', 'http://www.youtube.com/watch?v=RyJbvWAh6ec', ['legs', 'lower', 'hamstrings']);
                    exercises.addExercise('Supermans', null, ['legs', 'lower', 'hamstrings']);
                };
            }
        ]
    );

    app.controller(
        'ProfileCtrl',
        [
            function () {
            }
        ]
    );

    app.controller(
        'ExercisesCtrl',
        [
            'exercises',
            function (exercises) {
                this.search = '';
                this.items = exercises.items;

                this.addExercise = function () {
                    exercises.addExercise(this.search);
                };
            }
        ]
    );

    app.controller(
        'WorkoutsCtrl',
        [
            '$location',
            'workouts',
            function (location, workouts) {
                this.items = workouts.items;

                this.startWorkout = function () {
                    var workout = workouts.addWorkout();

                    location.path('/workout/' + workout.slug);
                };
            }
        ]
    );

    app.controller(
        'NutritionCtrl',
        [
            function () {
            }
        ]
    );

    app.controller(
        'MealsCtrl',
        [
            function () {
            }
        ]
    );

    app.controller(
        'ExerciseCtrl',
        [
            'exercise',
            function (exercise) {
                this.title = exercise.title;
                this.tags = exercise.tags;
                this.video = exercise.video;
            }
        ]
    );

    app.controller(
        'WorkoutCtrl',
        [
            'workouts',
            'workout',
            'exercises',
            function (workouts, workout, exercises) {
                this.slug = workout.slug;
                this.exercises = workout.exercises;
                this.es = exercises;

                this.addExercise = function (exercise) {
                    workout.exercises.push({
                        slug: exercise.slug,
                        sets: []
                    });

                    workouts.save();
                };

                this.addSet = function (exercise) {
                    exercise.sets.push({
                        reps: 0,
                        weight: 0
                    });

                    workouts.save();
                };

                this.removeSet = function (exercise, set) {
                    var index = exercise.sets.indexOf(set);

                    if (index != -1) {
                        exercise.sets.splice(index, 1);
                    }

                    workouts.save();
                };

                this.removeExercise = function (exercise) {
                    var index = workout.exercises.indexOf(exercise);

                    if (index != -1) {
                        workout.exercises.splice(index, 1);
                    }

                    workouts.save();
                };
            }
        ]
    );
})();
