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



                    exercises.addExercise('Barbell Bench Press (flat, incline or decline)', 'http://www.youtube.com/watch?v=rT7DgCr-3pg', ['push', 'upper', 'chest']);
                    exercises.addExercise('Dumbbell Bench Press (flat, incline or decline)', 'http://www.youtube.com/watch?v=622ku8i0M14', ['push', 'upper', 'chest']);
                    exercises.addExercise('Dips (with slight forward lean)', 'http://www.youtube.com/watch?v=-Ybtd_qks8M', ['push', 'upper', 'chest']);
                    exercises.addExercise('Chest Press Machine (flat, incline or decline)', 'http://www.youtube.com/watch?v=xUm0BiZCWlQ', ['push', 'upper', 'chest']);
                    exercises.addExercise('Dumbbell Flyes', 'http://www.youtube.com/watch?v=eozdVDA78K0', ['push', 'upper', 'chest']);
                    exercises.addExercise('Pec Deck Machines', '', ['push', 'upper', 'chest']);
                    exercises.addExercise('Cable Crossovers', '', ['push', 'upper', 'chest']);



                    exercises.addExercise('Overhead Barbell Press (seated or standing)', 'http://www.youtube.com/watch?v=ECWxumBMLVQ', ['push', 'upper', 'shoulder']);
                    exercises.addExercise('Overhead Dumbbell Press (seated or standing)', 'http://youtu.be/M2rwvNhTOu0?t=12s', ['push', 'upper', 'shoulder']);
                    exercises.addExercise('Arnold Press', 'http://www.youtube.com/watch?v=qHO94WIp924', ['push', 'upper', 'shoulder']);
                    exercises.addExercise('Overhead Press Machine', 'http://www.youtube.com/watch?v=Wqq43dKW1TU', ['push', 'upper', 'shoulder']);
                    exercises.addExercise('Lateral Raises', 'http://www.youtube.com/watch?v=3VcKaXpzqRo', ['push', 'upper', 'shoulder']);
                    exercises.addExercise('Front Raises', 'http://www.youtube.com/watch?v=-t7fuZ0KhDA', ['push', 'upper', 'shoulder']);



                    exercises.addExercise('Dips', 'http://www.youtube.com/watch?v=2i3o0bFZT_s', ['push', 'upper', 'triceps']);
                    exercises.addExercise('Close Grip Bench Press (flat or decline)', 'http://www.youtube.com/watch?v=nEF0bv2FW94', ['push', 'upper', 'triceps']);
                    exercises.addExercise('Laying Triceps Extension/Skull Crushers (flat/decline, barbell/dumbbell)', 'http://www.youtube.com/watch?v=d_KZxkY_0cM', ['push', 'upper', 'triceps']);
                    exercises.addExercise('Overhead Triceps Extension (barbell or dumbbell)', 'http://www.youtube.com/watch?v=YbX7Wd8jQ-Q', ['push', 'upper', 'triceps']);
                    exercises.addExercise('Cable Press Downs', 'http://www.youtube.com/watch?v=2-LAMcpzODU', ['push', 'upper', 'triceps']);



                    exercises.addExercise('Barbell Curls', 'http://www.youtube.com/watch?v=gPYubp8x7FA', ['pull', 'upper', 'biceps']);
                    exercises.addExercise('Dumbbell Curls (seated or standing)', 'http://www.youtube.com/watch?v=av7-8igSXTs', ['pull', 'upper', 'biceps']);
                    exercises.addExercise('Preacher Curls (barbell or dumbbell)', 'http://www.youtube.com/watch?v=GERCafX8b8I', ['pull', 'upper', 'biceps']);
                    exercises.addExercise('Incline Dumbbell Curls', 'http://www.youtube.com/watch?v=soxrZlIl35U', ['pull', 'upper', 'biceps']);
                    exercises.addExercise('Hammer Curls', 'http://www.youtube.com/watch?v=av7-8igSXTs', ['pull', 'upper', 'biceps']);
                    exercises.addExercise('Cable Curls', 'http://www.youtube.com/watch?v=kyyP5l8noSY', ['pull', 'upper', 'biceps']);



                    exercises.addExercise('Chinups', 'http://www.youtube.com/watch?v=OZJD5fKVE1Y', ['pull', 'upper', 'back']);
                    exercises.addExercise('Pull ups', 'http://www.youtube.com/watch?v=bAEua0zu_74', ['pull', 'upper', 'back']);
                    exercises.addExercise('Lat Pull Downs', 'http://www.youtube.com/watch?v=JEb-dwU3VF4', ['pull', 'upper', 'back']);
                    exercises.addExercise('Bent Over Barbell & Dumbbell Rows', 'http://www.youtube.com/watch?v=NPudhGhZJxI', ['pull', 'upper', 'back']);
                    exercises.addExercise('Seated Cable Rows', 'http://www.youtube.com/watch?v=GZbfZ033f74', ['pull', 'upper', 'back']);
                    exercises.addExercise('T-Bar Rows', 'http://www.youtube.com/watch?v=j3Igk5nyZE4', ['pull', 'upper', 'back']);
                    exercises.addExercise('Chest Supported Machine Rows', 'http://www.youtube.com/watch?v=jUDnDJnTvmY', ['pull', 'upper', 'back']);
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

                this.adding = false;

                this.showExercises = function () {
                    this.adding = true;
                };

                this.hideExercises = function () {
                    this.adding = false;
                };

                this.addExercise = function (exercise) {
                    workout.exercises.push({
                        slug: exercise.slug,
                        sets: []
                    });

                    workouts.save();
                };

                this.addWeight = function (set, value) {
                    set.weight += value;
                    workouts.save();
                };

                this.addRep = function (set, value) {
                    set.reps += value;
                    workouts.save();
                };

                this.addSet = function (exercise) {
                    var last = exercise.sets.length > 0 ? exercise.sets[exercise.sets.length - 1].weight : 0;

                    exercise.sets.push({
                        reps: 0,
                        weight: last
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
