// Generated by LiveScript 1.2.0
(function(){
  var ref$, filter, flatten, map, sort, sortBy, unique, values, slugify, selectRandom, slugifyDb, slugifyList, slugifyProject, categoriesIn, subcategoriesIn, subcategoriesInRaw, subcategoriesOf, imagesIn, inThisCategory, inThisSubcategory, inTheseSubcategories, inThisProtocol, nestedCategories, nestedCategoriesWeb, protocolTypes;
  ref$ = require('prelude-ls'), filter = ref$.filter, flatten = ref$.flatten, map = ref$.map, sort = ref$.sort, sortBy = ref$.sortBy, unique = ref$.unique, values = ref$.values;
  slugify = require('./slugify.ls').slugify;
  selectRandom = function(list){
    return list[Math.floor(Math.random() * list.length)];
  };
  slugifyDb = function(db){
    var list, i$, len$, project;
    list = db;
    for (i$ = 0, len$ = list.length; i$ < len$; ++i$) {
      project = list[i$];
      project.slug = slugify(project.name);
      project.categories = sortBy(fn$, project.categories);
    }
    return list = sortBy(function(it){
      return it.name.toLowerCase();
    }, list);
    function fn$(it){
      return it.name.toLowerCase();
    }
  };
  slugifyList = function(list){
    return map(function(it){
      return {
        name: it,
        slug: slugify(it)
      };
    }, list);
  };
  slugifyProject = function(project){
    var i$, ref$, len$, category;
    if (project.protocols != null) {
      project.protocolsSlugged = slugifyList(project.protocols);
    }
    if (project.categories != null) {
      for (i$ = 0, len$ = (ref$ = project.categories).length; i$ < len$; ++i$) {
        category = ref$[i$];
        category.slug = slugify(category.name);
        category.subcategories = slugifyList(category.subcategories);
      }
    }
    return project;
  };
  categoriesIn = function(db){
    var list;
    list = flatten(map(function(it){
      return it.categories;
    }, db));
    list = map(function(it){
      return it.name;
    }, list);
    list = unique(list);
    list = slugifyList(list);
    return list = sortBy(function(it){
      return it.name.toLowerCase();
    }, list);
  };
  subcategoriesIn = function(categoryName, db){
    var list;
    list = flatten(map(function(it){
      return it.categories;
    }, db));
    list = filter(function(it){
      return it.name === categoryName;
    }, list);
    list = map(function(it){
      return it.subcategories;
    }, list);
    list = unique(flatten(list));
    list = slugifyList(list);
    return list = sortBy(function(it){
      return it.name.toLowerCase();
    }, list);
  };
  subcategoriesInRaw = function(categoryName, db){
    var list;
    list = flatten(map(function(it){
      return it.categories;
    }, db));
    list = filter(function(it){
      return it.name === categoryName;
    }, list);
    list = map(function(it){
      return it.subcategories;
    }, list);
    return list = unique(flatten(list));
  };
  subcategoriesOf = function(project){
    var list;
    list = flatten(map(function(it){
      return it.subcategories;
    }, project.categories));
    list = map(function(it){
      return it.name;
    }, list);
    list = unique(flatten(list));
    return list = sort(list);
  };
  imagesIn = function(db){
    var list;
    return list = map(function(it){
      return it.logo;
    }, db);
  };
  inThisCategory = function(categoryName, db){
    var list, i$, len$, project, j$, ref$, len1$, category;
    list = [];
    for (i$ = 0, len$ = db.length; i$ < len$; ++i$) {
      project = db[i$];
      for (j$ = 0, len1$ = (ref$ = project.categories).length; j$ < len1$; ++j$) {
        category = ref$[j$];
        if (category.name === categoryName) {
          list.push(project);
        }
      }
    }
    return list = unique(list);
  };
  inThisSubcategory = function(subcategoryName, db){
    var list, i$, len$, project, j$, ref$, len1$, category, k$, ref1$, len2$, subcategory;
    list = [];
    for (i$ = 0, len$ = db.length; i$ < len$; ++i$) {
      project = db[i$];
      for (j$ = 0, len1$ = (ref$ = project.categories).length; j$ < len1$; ++j$) {
        category = ref$[j$];
        for (k$ = 0, len2$ = (ref1$ = category.subcategories).length; k$ < len2$; ++k$) {
          subcategory = ref1$[k$];
          if (subcategory === subcategoryName) {
            list.push(project);
          }
        }
      }
    }
    return list = unique(list);
  };
  inTheseSubcategories = function(subcategories, db){
    var list, i$, len$, subcategory;
    list = [];
    for (i$ = 0, len$ = subcategories.length; i$ < len$; ++i$) {
      subcategory = subcategories[i$];
      list.push(inThisSubcategory(subcategory, db));
    }
    return list = unique(list);
  };
  inThisProtocol = function(protocol, db){
    return filter(function(it){
      return in$(protocol, it.protocols);
    }, db);
  };
  nestedCategories = function(db){
    var tree, i$, len$, category, j$, ref$, len1$, subcategory;
    tree = categoriesIn(db);
    for (i$ = 0, len$ = tree.length; i$ < len$; ++i$) {
      category = tree[i$];
      category.subcategories = subcategoriesIn(category.name, inThisCategory(category.name, db));
      category.subcategories = sortBy(fn$, category.subcategories);
      for (j$ = 0, len1$ = (ref$ = category.subcategories).length; j$ < len1$; ++j$) {
        subcategory = ref$[j$];
        subcategory.projects = inThisSubcategory(subcategory.name, inThisCategory(category.name, db));
        subcategory.projectLogos = imagesIn(subcategory.projects);
        subcategory.randomLogo = selectRandom(subcategory.projectLogos);
      }
    }
    return tree = sortBy(function(it){
      return it.name.toLowerCase();
    }, tree);
    function fn$(it){
      return it.name.toLowerCase();
    }
  };
  nestedCategoriesWeb = function(db){
    var tree, i$, len$, category, catSubcategories, webSubcategories, allSubcategories, j$, ref$, len1$, subcategory;
    tree = categoriesIn(db);
    for (i$ = 0, len$ = tree.length; i$ < len$; ++i$) {
      category = tree[i$];
      catSubcategories = subcategoriesInRaw(category.name, inThisCategory(category.name, db));
      webSubcategories = subcategoriesInRaw('Web Services', inThisCategory('Web Services', db));
      allSubcategories = slugifyList(unique(catSubcategories.concat(webSubcategories)));
      category.subcategories = allSubcategories;
      category.subcategories = sortBy(fn$, category.subcategories);
      for (j$ = 0, len1$ = (ref$ = category.subcategories).length; j$ < len1$; ++j$) {
        subcategory = ref$[j$];
        subcategory.projects = inThisSubcategory(subcategory.name, inThisCategory(category.name, db));
        subcategory.projectLogos = imagesIn(subcategory.projects);
        subcategory.randomLogo = selectRandom(subcategory.projectLogos);
      }
    }
    return tree = sortBy(function(it){
      return it.name.toLowerCase();
    }, tree);
    function fn$(it){
      return it.name.toLowerCase();
    }
  };
  protocolTypes = function(protocols){
    var types, i$, len$, type;
    types = categoriesIn(protocols);
    for (i$ = 0, len$ = types.length; i$ < len$; ++i$) {
      type = types[i$];
      type.protocols = inThisCategory(type.name, protocols);
    }
    return types;
  };
  exports.selectRandom = selectRandom;
  exports.shuffleArray = selectRandom;
  exports.slugifyDb = slugifyDb;
  exports.slugifyList = slugifyList;
  exports.slugifyProject = slugifyProject;
  exports.categoriesIn = categoriesIn;
  exports.subcategoriesIn = subcategoriesIn;
  exports.subcategoriesInRaw = subcategoriesInRaw;
  exports.subcategoriesOf = subcategoriesOf;
  exports.imagesIn = imagesIn;
  exports.inThisCategory = inThisCategory;
  exports.inThisSubcategory = inThisSubcategory;
  exports.inTheseSubcategories = inTheseSubcategories;
  exports.inThisProtocol = inThisProtocol;
  exports.nestedCategories = nestedCategories;
  exports.nestedCategoriesWeb = nestedCategoriesWeb;
  exports.protocolTypes = protocolTypes;
  function in$(x, xs){
    var i = -1, l = xs.length >>> 0;
    while (++i < l) if (x === xs[i]) return true;
    return false;
  }
}).call(this);
