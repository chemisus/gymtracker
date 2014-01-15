'use strict';

(function () {
    var app = angular.module('GymTrackerApp', ['ngRoute']);

    app.config(
        [
            '$routeProvider',
            function (router) {
                router.when('/', {
                    templateUrl: '/assets/html/home.html',
                    controller: 'HomeCtrl',
                    controllerAs: 'home'
                });

                router.when('/profile', {
                    templateUrl: '/assets/html/profile.html',
                    controller: 'HomeCtrl',
                    controllerAs: 'home'
                });

                router.when('/exercises', {
                    templateUrl: '/assets/html/exercises.html',
                    controller: 'ExercisesCtrl',
                    controllerAs: 'exercises'
                });

                router.when('/workouts', {
                    templateUrl: '/assets/html/workouts.html',
                    controller: 'WorkoutsCtrl',
                    controllerAs: 'workouts'
                });

                router.when('/nutrition', {
                    templateUrl: '/assets/html/nutrition.html',
                    controller: 'NutritionCtrl',
                    controllerAs: 'nutrition'
                });

                router.when('/meals', {
                    templateUrl: '/assets/html/meals.html',
                    controller: 'MealsCtrl',
                    controllerAs: 'meals'
                });

                router.when('/exercise/:slug', {
                    templateUrl: '/assets/html/exercise.html',
                    controller: 'ExerciseCtrl',
                    controllerAs: 'exercise',
                    resolve: {
                        'exercise': ['$route', 'exercises', function ($route, exercises) {
                            var slug = $route.current.params.slug;

                            return exercises.findBySlug(slug);
                        }]
                    }
                });

                router.otherwise({
                    redirectTo: '/'
                });
            }
        ]
    );

    app.filter(
        'find',
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
        'findExercise',
        [
            'findFilter',
            function (find) {
                return function (item, search) {
                    return find(item, search, ['title']);
                }
            }
        ]
    );

    /*
     */

    app.service(
        'exercises',
        [
            function () {
                this.items = [];

                this.addExercise = function (title, video, tags, slug) {
                    slug = slug || title.toLowerCase().replace(' ', '-');

                    this.items.push({
                        title: title,
                        slug: slug,
                        video: video,
                        tags: tags
                    });
                };

                this.findBySlug = function(value) {
                    for (var i in this.items) {
                        if (this.items[i].slug == value) {
                            return this.items[i];
                        }
                    }

                    return null;
                };

                this.addExercise('Back Squat', 'http://www.youtube.com/watch?v=2dpwZ0Vaih4', ['legs', 'lower', 'quads']);
                this.addExercise('Front Squat', undefined, ['legs', 'lower', 'quads']);
                this.addExercise('Leg Press', undefined, ['legs', 'lower', 'quads']);
                this.addExercise('Split Squat', 'http://www.youtube.com/watch?v=r1jukGZPnZI', ['legs', 'lower', 'quads']);
                this.addExercise('Lunges', 'http://www.youtube.com/watch?v=Z2n58m2i4jg', ['legs', 'lower', 'quads']);
                this.addExercise('Step Ups', 'http://www.youtube.com/watch?v=dQqApCGd5Ss', ['legs', 'lower', 'quads']);
                this.addExercise('Leg Extensions', undefined, ['legs', 'lower', 'quads']);

                this.addExercise('Romanian Deadlift', 'http://www.youtube.com/watch?v=WtWtjViRsKo', ['legs', 'lower', 'hamstrings']);
                this.addExercise('Stiff Legged Deadlift', 'http://www.youtube.com/watch?v=gtevN0SWp-o', ['legs', 'lower', 'hamstrings']);
                this.addExercise('Glute-Ham Raises', 'http://www.youtube.com/watch?v=tCsyyC5E7M8', ['legs', 'lower', 'hamstrings']);
                this.addExercise('Pull Thrus', 'http://www.youtube.com/watch?v=A32WSOB-6Gw', ['legs', 'lower', 'hamstrings']);
                this.addExercise('Leg Curls', null, ['legs', 'lower', 'hamstrings']);
                this.addExercise('Good Mornings', 'http://www.youtube.com/watch?v=Iycq-kJann0', ['legs', 'lower', 'hamstrings']);
                this.addExercise('Deadlift', 'http://www.youtube.com/watch?v=RyJbvWAh6ec', ['legs', 'lower', 'hamstrings']);
                this.addExercise('Supermans', null, ['legs', 'lower', 'hamstrings']);
            }
        ]
    );

    app.controller(
        'HomeCtrl',
        [
            function () {
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
            function () {
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
})();
