let introDel = {};

let delList = [
    {
        key: 'reg',
        value: '~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~...'
    },
    {
        key: 'reg',
        value: '&amp;',
    },
    {
        key: 'reg',
        value: 'amp;'
    },
    {
        key: 'reg',
        value: 'ldquo;'
    },
    {
        key: 'reg',
        value: 'rdquo;'
    },
    {
        key: 'reg',
        value: 'javascript:share'
    },
    {
        key: 'reg',
        value: '　　――――――――――――――――――――――――　　'
    },
    {
        key: 'reg',
        value: '――――――――――――――――――――――'
    },
    {
        key: 'reg',
        value: '――――――――――――――――――――――――――――――――――――――'
    },
    {
        key: 'reg',
        value: '――――――――――――――――――――――――――――'
    },
    {
        key: 'reg',
        value: '--------------------------------------------------------------------------------------------------------------'
    },
    {
        key: 'reg',
        value: '――――――――――――――――――――――――'
    }, {
        key: 'reg',
        value: '―――――――――――――――――――――――――――――――――'
    }, {
        key: 'reg',
        value: '——————————————'
    },
    {
        key: 'reg',
        value: '…………………………………………………………………………'
    },
    {
        key: 'reg',
        value: '————————————————————————————'
    },
    {
        key: 'reg',
        value: '————————————————————————————————————————————————'
    },
    {
        key: 'reg',
        value: '…………………………'
    },
    {
        key: 'reg',
        value: '………………………………………………………………'
    },
    {
        key: 'reg',
        value: '====================='
    },
    {
        key: 'reg',
        value: 'lt;/agt;'
    },
    {
        key: 'reg',
        value: 'lt;/stronggt; raquo;raquo;raquo;raquo; lt;a href=;http://www.kenwen.com/cview/38/38646/5380637.html; target=;_blank;gt;'
    },
    {
        key: 'reg',
        value: 'lt;div id=;lastchapter;gt;lt;stronggt;'
    },
    {
        key: 'reg',
        value: '#;#;'
    },
    {
        key: 'common',
        value: '***********************************************'
    },
    {
        key: 'common',
        value: '***********************************************************'
    }
];

introDel.getIntro = function (originIntro) {
    if (originIntro) {
        let result = originIntro;
        for (let item of delList) {
            if (result.includes(item.value)) {
                if (item.key === 'reg') {
                    result = result.replace(new RegExp(item.value, 'g'), '');
                } else {
                    result = result.replace(item.value, '');
                }
            }
        }
        return result;
    } else {
        return '暂无简介...';
    }
};
export default introDel;