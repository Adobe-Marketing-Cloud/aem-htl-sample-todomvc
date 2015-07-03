/*
 * Copyright (c) 2014 Adobe Systems Incorporated. All rights reserved.
 *  
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 * http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * 
 * Please note that some portions of this project are written by third parties
 * under different license terms. Your use of those portions are governed by
 * the license terms contained in the corresponding files. 
 */

/**
 * Returns an object with following member:
 * {String} updatePath: The URL on which the web app can retreive an HTML fragment to update the view
 */
use('/apps/todo/components/utils/filters.js', function (filters) {
    'use strict';

    var filterSelector = filters.isAll ? '' : ('.' + filters.selector);
    
    return {
        updatePath: currentPage.path + '.todoapp' + filterSelector + '.html'
    };
});