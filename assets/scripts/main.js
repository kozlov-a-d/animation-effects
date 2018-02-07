require('../styles/main.scss');

import triangles from './animations/moving-elements/triangles';

 
console.time('app');

triangles({
    // parent element
    root: document.querySelector('.js-triangle-moving'),
    datGUI: true,
    // original svg
    elementsOriginal: [
        { // element 1
            width: 1920,    
            height: 960,
            polylines: [324.5,332,365.9,339.4,331.6,321,
                313.8,338,329.9,369.4,324.5,332,
                351.2,358.1,365.9,339.4,324.5,332,
                329.9,369.4,351.2,358.1,324.5,332,
                331.6,321,371.4,312.9,334.2,304.1,
                371.4,312.9,371.4,184.2,334.2,304.1,
                305.1,373.2,329.9,369.4,313.8,338,
                247.4,356.2,273.7,369.1,283,337.2,
                283,337.2,273.7,369.1,300.2,339.8,
                334.2,304.1,371.4,184.2,334.2,184.2,
                264.8,327.5,247.4,356.2,283,337.2,
                300.2,339.8,305.1,373.2,313.8,338,
                273.7,369.1,305.1,373.2,300.2,339.8,
                365.9,339.4,371.4,312.9,331.6,321,
                443.5,236.4,410.7,258.6,446.4,246.1,
                446.4,246.1,422.8,273.5,454.7,252.9,
                410.7,258.6,422.8,273.5,446.4,246.1,
                422.8,273.5,440.4,283.6,454.7,252.9,
                446.1,334.5,434.8,367.3,472.4,339.5,
                420.7,319.9,399.7,347.1,446.1,334.5,
                454.7,252.9,440.4,283.6,467.9,257.9,
                434.8,367.3,473.2,373,472.4,339.5,
                399.7,347.1,434.8,367.3,446.1,334.5,
                406.3,237.2,410.7,258.6,443.5,236.4,
                501.9,307.4,505,317.7,544.7,317.5,
                472.4,339.5,473.2,373,487.6,337.7,
                505,317.7,539.3,341.5,544.7,317.5,
                440.4,283.6,461.2,290.3,467.9,257.9,
                492.9,300.5,501.9,307.4,530,282.1,
                461.2,290.3,479,295.3,485.5,262.3,
                467.9,257.9,461.2,290.3,485.5,262.3,
                485.5,262.3,479,295.3,530,282.1,
                479,295.3,492.9,300.5,530,282.1,
                530,282.1,501.9,307.4,544.7,317.5,
                473.2,373,501.5,369.4,487.6,337.7,
                462.4,215.7,443.7,185.1,452.9,219.7,
                443.7,185.1,423.7,196.8,452.9,219.7,
                473.2,214.4,469.9,180.9,462.4,215.7,
                452.9,219.7,423.7,196.8,446.1,226.5,
                504.2,184.2,469.9,180.9,473.2,214.4,
                446.1,226.5,410.8,214.7,443.5,236.4,
                410.8,214.7,406.3,237.2,443.5,236.4,
                423.7,196.8,410.8,214.7,446.1,226.5,
                469.9,180.9,443.7,185.1,462.4,215.7,
                496.3,217.4,504.2,184.2,473.2,214.4,
                501.5,369.4,524.2,359,497.6,332.8,
                524.2,359,539.3,341.5,503.2,325.8,
                487.6,337.7,501.5,369.4,497.6,332.8,
                497.6,332.8,524.2,359,503.2,325.8,
                521,228.3,504.2,184.2,496.3,217.4,
                537.4,198.3,504.2,184.2,521,228.3,
                503.2,325.8,539.3,341.5,505,317.7]
        }, 
        { // element 2
            width: 1024,    
            height: 768,
            polylines: [83,488,141,488,120,459,
                74,479,83,488,120,459,
                120,459,141,488,188,455,
                141,488,215,488,188,455,
                74,222,74,479,119,266,
                119,266,74,479,120,459,
                220,394,215,488,262,464,
                188,455,215,488,220,394,
                411,205,466,0,349,88,
                349,88,466,0,273,63,
                466,0,87,1,273,63,
                81,210,74,222,119,266,
                0,197,36,152,0,132,
                429,334,466,0,411,205,
                188,455,220,394,120,459,
                120,459,220,394,119,266,
                119,266,220,394,224,343,
                208,261,119,266,224,343,
                262,464,288,396,220,394,
                288,396,291,338,220,394,
                220,394,291,338,224,343,
                209,210,150,210,208,261,
                266,241,209,210,208,261,
                208,261,150,210,119,266,
                150,210,81,210,119,266,
                224,343,291,338,208,261,
                291,338,266,241,208,261,
                273,63,87,1,93,67,
                413,446,360,433,349,524,
                360,433,324,510,349,524,
                324,510,222,548,349,524,
                222,548,373,548,349,524,
                369,338,360,433,413,446,
                429,334,369,338,413,446,
                373,548,442,515,413,446,
                429,334,466,456,466,0,
                349,524,373,548,413,446,
                413,446,466,456,429,334,
                442,515,466,456,413,446,
                411,205,369,338,429,334,
                297,172,351,231,411,205,
                0,82,0,132,34,85,
                0,132,36,152,34,85,
                34,85,36,152,93,67,
                36,152,227,150,93,67,
                87,1,30,27,34,85,
                30,27,0,82,34,85,
                93,67,227,150,273,63,
                349,88,297,172,411,205,
                93,67,87,1,34,85,
                227,150,297,172,349,88,
                351,231,369,338,411,205,
                273,63,227,150,349,88]
        }
    ]
    

});

console.timeEnd('app');