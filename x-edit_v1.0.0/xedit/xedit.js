/**
 * Created by xinweiGroup on 2018/01/09.
 * @guopeipei
 * @version:v1.0.0
 * @example
 * new XEditor(xeditConfig)
 * @description
 *暂时不支持图片上传，可以加载网络图片
 *作者邮箱1581810850@qq.com
参数：
当前需要插入文本编辑器的dom元素：	currentDom
默认值：也可将默认divhtml写入文本编辑器中 defaultHTML
按钮组：false：不显示，true或不写：显示
			getHTMLBtn:false,
			defaultHTML:'',
            unDoBtn:false,
            reDoBtn:false,
            boldBtn:false,
            italicBtn:false,        
            underlineBtn:false,      
            strikeThroughBtn:false,       
            fontFamilyBtn:false,      
            fontSizeBtn:true,      
            colorBtn:false,
            bgcolorBtn:false,
            orderedlistBtn:false,
            unorderedlistBtn:false,
            justifyLeftBtn:false,
            justifyCenterBtn:false,
            justifyRightBtn:false,
            paragraphBtn:false,
            linkBtn:false,
            unlinkBtn:false,
            tableBtn:false,
            imageBtn:false,
			getHTMLFn:null //回调：（参数为最新html）
 * @last modify guopeipei 
 */
window.XEditor=function(options)
{
	//默认配置项
	this.xeditBtnConfig={
		getHTMLBtn:true,defaultHTML:"",unDoBtn:true,reDoBtn:true,boldBtn:true,italicBtn:true,underlineBtn:true,strikeThroughBtn:true,
		fontFamilyBtn:true, fontSizeBtn:true,colorBtn:true,bgcolorBtn:true,orderedlistBtn:true,unorderedlistBtn:true,
		justifyLeftBtn:true,justifyCenterBtn:true,justifyRightBtn:true,paragraphBtn:true,linkBtn:true,unlinkBtn:true,
		tableBtn:true,imageBtn:true,
        getHTMLFn:null,
	};
	//字体颜色，背景颜色
	this.colors=[
                    ['#ffffff','#000000','#eeece1','#1f497d','#4f81bd','#c0504d','#9bbb59','#8064a2','#4bacc6','#f79646'],
                    ['#f2f2f2','#7f7f7f','#ddd9c3','#c6d9f0','#dbe5f1','#f2dcdb','#ebf1dd','#e5e0ec','#dbeef3','#fdeada'],
                    ['#d8d8d8','#595959','#c4bd97','#8db3e2','#b8cce4','#e5b9b7','#d7e3bc','#ccc1d9','#b7dde8','#fbd5b5'],
                    ['#bfbfbf','#3f3f3f','#938953','#548dd4','#95b3d7','#d99694','#c3d69b','#b2a2c7','#92cddc','#fac08f'],
                    ['#a5a5a5','#262626','#494429','#17365d','#366092','#953734','#76923c','#5f497a','#31859b','#e36c09'],
                    ['#7f7f7f','#0c0c0c','#1d1b10','#0f243e','#244061','#632423','#4f6128','#3f3151','#205867','#974806'],
                    ['#c00000','#ff0000','#ffc000','#ffff00','#92d050','#00b050','#00b0f0','#0070c0','#002060','#7030a0'],
                ];
    //字样样式
    this.fontFamilys=[
                	["sans-serif","宋体,SimSun","微软雅黑,Microsoft YaHei","楷体, 楷体_GB2312, SimKai","黑体, SimHei","隶书, SimLi","andale mono","arial, helvetica,sans-serif","arial black,avant garde","comic sans ms","impact,chicago","times new roman"],
                	["sans-serif","SimSun","Microsoft YaHei","SimKai","SimHei","SimLi","andale mono","arial","arial black","comic sans ms","impact","times new roman"],
                ];
    //段落
    this.paragraphs=[
        			['div','p','h1','h2','h3','h4','h5','h6'],
        			['16px','16px','36px','28px','24px','18px','16px','12px']
        		];
    //字体大小
    this.fontsizes=[[10,12,16,18,24,32,48],[1,2,3,4,5,6,7]];
	this.initXEditConfig(options);
	this.initHtml(options.currentDom);
	this.initXEdit(options);
	this.addAllXEditEvent();
}
//初始化参数
XEditor.prototype.initXEditConfig=function(options)
{	
	var _self=this;
    //更新配置项
	for(var item in options){
		//_self.xeditBtnConfig[item] || _self.xeditBtnConfig[item]===null 不可行，undefine和null都要考虑
		if(_self.xeditBtnConfig.hasOwnProperty(item)){
			_self.xeditBtnConfig[item]=options[item];
		}
	}
	if(options.getHTMLFn){
		_self.optionGetValue=options.getHTMLFn;
	}	
}
//初始化HTML,及DOM对象
XEditor.prototype.initHtml=function(currentDom){
	var _self=this;
	var onlyId="xedit_"+_self.getuuid();
	var xeditHTML='<div id="'+onlyId+'" class="xedit_component" >' 
	            +'<div class="edit_header" >'
	            +    '<div class="edit_toolbar">'

	            +(_self.xeditBtnConfig.getHTMLBtn?(
	            	'<button class="btn" name="getHTML">'
	            +        '<span class="icon icon_source" name="getHTML"></span>'
	            +    '</button>'
	            +        '<div class="btn_separator"></div>'
	            ):'') 

	            +(_self.xeditBtnConfig.unDoBtn?(
	                     '<button class="btn" name="unDo">'
	            +           ' <span class="icon icon_undo" name="unDo"></span>'
	            +        '</button>'
				):'')  

				+(_self.xeditBtnConfig.reDoBtn?(
				         '<button class="btn" name="reDo">'
	            +           ' <span class="icon icon_redo" name="reDo"></span>'
	            +        '</button>'
				):'')        
	            
	            +(_self.xeditBtnConfig.unDoBtn || _self.xeditBtnConfig.reDoBtn?(
	                     '<div class="btn_separator"></div>'
	            ):'')
	            
	            +(_self.xeditBtnConfig.boldBtn?(
	                     '<button class="btn" name="setFontBold">'
	            +            '<span class="icon icon_bold" name="setFontBold"></span>'
	            +        '</button>'
	            ):'')
	            
	            +(_self.xeditBtnConfig.italicBtn?(
	                     '<button class="btn" name="setFontItalic">'
	            +            '<span class="icon icon_italic" name="setFontItalic"></span>'
	            +        '</button>'
	            ):'')

	            +(_self.xeditBtnConfig.underlineBtn?(
	                     '<button class="btn" name="setFontUnderline">'
	            +            '<span class="icon icon_underline" name="setFontUnderline"></span>'
	            +        '</button>'
	            ):'')
	            
	            +(_self.xeditBtnConfig.strikeThroughBtn?(
	                     '<button class="btn" name="setFontStrikeThrough">'
	            +            '<span class="icon icon_strikethrough" name="setFontStrikeThrough"></span>'
	            +        '</button>'
	            ):'')
	            
	            +(_self.xeditBtnConfig.boldBtn||_self.xeditBtnConfig.italicBtn||_self.xeditBtnConfig.underlineBtn||_self.xeditBtnConfig.strikeThroughBtn?(
	                    '<div class="btn_separator"></div>'
	            ):'')
	            
	            +(_self.xeditBtnConfig.fontFamilyBtn?(
	                     '<div class="btn btn_fontfamily edit_combobox " name="showFontFamily">'
	            +            '<span class="fontfamily_value btn_label" name="showFontFamily">sans-serif</span>'
	            +            '<span class="icon edit_cart"  name="showFontFamily"></span>'
	            +            '<ul class="combobox_menu combobox_fontfamily none">'
	            +            '</ul>'
	            +        '</div>'
	            ):'')
	            
	            +(_self.xeditBtnConfig.fontSizeBtn?(
	                     '<div class="btn btn_fontsize edit_combobox" name="showFontSize">'
	            +           '<span class="combobox_fontsize_value btn_label" name="showFontSize">12</span>'
	            +            '<span class="icon edit_cart"  name="showFontSize"></span>'
	            +           '<ul class="combobox_menu combobox_fontsize none">'
	            +            '</ul>'
	            +        '</div>'
	            ):'')

	            +(_self.xeditBtnConfig.colorBtn?(
	                     '<div class="btn btn_color" name="showColor">'
	            +            '<span class="icon icon_color" name="showColor"></span>'
	            +            '<span class="icon icon_dropdown" name="showColor"></span>'
	            +            '<div class="color_dropdown none">'
	            +                '<div class="color_dropdown_body color_dropdown_table" onmousedown="xEditObj.getColor(event)">'
	            +                '</div>'
	            +            '</div>'
	            +        '</div>'
	            ):'')
	            +(_self.xeditBtnConfig.bgcolorBtn?(
	                     '<div class="btn btn_bgcolor" name="showBgColor">'
	            +            '<span class="icon icon_bg_color" name="showBgColor"></span>'
	            +            '<span class="icon icon_dropdown" name="showBgColor"></span>'
	            +            '<div class="bg_color_dropdown none">'
	            +                '<div class="color_dropdown_body bg_color_dropdown_table" onmousedown="xEditObj.getBgColor(event)">'
	            +               '</div>'
	            +            '</div>'
	            +        '</div>'
	            ):'')
	            
	            +(_self.xeditBtnConfig.fontFamilyBtn||_self.xeditBtnConfig.fontSizeBtn||_self.xeditBtnConfig.colorBtn||_self.xeditBtnConfig.bgcolorBtn?(
	                    ' <div class="btn_separator"></div>'
	            ):'')

	            +(_self.xeditBtnConfig.orderedlistBtn?(
	                     '<button class="btn" name="getOrderedList">'
	            +            '<span class="icon icon_ordered_list" name="getOrderedList"></span>'
	            +        '</button>'
	            ):'')
	            
	            +(_self.xeditBtnConfig.unorderedlistBtn?(
	                     '<button class="btn" name="getUnorderedList">'
	            +            '<span class="icon icon_unordered_list" name="getUnorderedList"></span>'
	            +        '</button>'
	            ):'')
	            
	            +(_self.xeditBtnConfig.orderedlistBtn||_self.xeditBtnConfig.unorderedlistBtn?(
	                    '<div class="btn_separator"></div>'
	            ):'')
	            
	            +(_self.xeditBtnConfig.justifyLeftBtn?(
	                     '<button class="btn" name="justifyLeft">'
	            +            '<span class="icon icon_justify_left" name="justifyLeft"></span>'
	            +        '</button>'
	            ):'')
	            
	            +(_self.xeditBtnConfig.justifyCenterBtn?(
	                    '<button class="btn" name="justifyCenter">'
	            +            '<span class="icon icon_justify_center" name="justifyCenter"></span>'
	            +        '</button>'
	            ):'')

	            +(_self.xeditBtnConfig.justifyRightBtn?(
	                     '<button class="btn" name="justifyRight">'
	            +            '<span class="icon icon_justify_right" name="justifyRight"></span>'
	            +        '</button>'
	            ):'')
	            
	            +(_self.xeditBtnConfig.justifyLeftBtn||_self.xeditBtnConfig.justifyCenterBtn||_self.xeditBtnConfig.justifyRightBtn?(
	                     '<div class="btn_separator"></div>'
	            ):'')
	            
	            +(_self.xeditBtnConfig.paragraphBtn?(
	                     '<div class="btn btn_paragraph edit_combobox" name="showParagraph">'
	            +            '<span class="combobox_paragraph_value btn_label" name="showParagraph">div</span>'
	            +            '<span class="icon edit_cart"  name="showParagraph"></span>'
	            +            '<ul class="combobox_menu combobox_paragraph none">'
	            +            '</ul>'
	            +        '</div>'
	            ):'')

	            +(_self.xeditBtnConfig.paragraphBtn?(
	                    '<div class="btn_separator"></div>'
	            ):'')
	            
	            +(_self.xeditBtnConfig.linkBtn?(
	                     '<button class="btn" name="createLink">'
	            +            '<span class="icon icon_link" name="createLink"></span>'
	            +        '</button>'
	            ):'')

	            +(_self.xeditBtnConfig.unlinkBtn?(
	                     '<button class="btn" name="unLink">'
	            +            '<span class="icon icon_unlink" name="unLink"></span>'
	            +        '</button>'
	            ):'')
	            
	            +(_self.xeditBtnConfig.linkBtn||_self.xeditBtnConfig.unlinkBtn?(
	                     '<div class="btn_separator"></div>'
	            ):'')
	            
	            +(_self.xeditBtnConfig.tableBtn?(
	                     '<button class="btn" name="showTable">'
	            +           '<span class="icon icon_table" name="showTable"></span>'
	            +        '</button>'
	            ):'')
	            
	            +(_self.xeditBtnConfig.imageBtn?(
	                    '<button class="btn" name="showImg">'
	            +            '<div class="icon icon_img" name="showImg"></div>'
	            +        '</button>'
	            ):'')
	            
	            +    '</div>'
	            +    '<div class="edit_mask none">'

	            +(_self.xeditBtnConfig.tableBtn?(
	                     '<div class="edit_mask_table none">'
	            +           '<div class="mask_header">表格</div>'
	            +           '<table class="mask_table">'
	            +              '<tr>'
	            +                   '<td>单元格数:</td>'
	            +                   '<td>行数<input type="text" class="edit_table_tr" name="edit_table_tr" value="2"></td>'
	            +                   '<td>列数<input type="text"  class="edit_table_td" name="" value="3"></td>'
	            +               '</tr>'
	            +               '<tr>'
	            +                   '<td>大小:</td>'
	            +                    '<td>宽度'
	            +                        '<input type="text" class="edit_table_width" name="" value="100">'
	            +                        '<select class="edit_table_width_unit">'
	            +                            '<option value="0">%</option>'
	            +                            '<option value="1">px</option>'
	            +                        '</select>'
	            +                   '</td>'
	            +                   '<td>'
	            +                        '高度'
	            +                        '<input class="edit_table_height" type="text" name="">'
	            +                        '<select  class="edit_table_height_unit">'
	            +                           ' <option value="0">%</option>'
	            +                            '<option value="1">px</option>'
	            +                        '</select>'
	            +                    '</td>'
	            +               '</tr>'
	            +               '<tr>'
	            +                   '<td>边距间距:</td>'
	            +                   '<td>边距<input class="edit_table_padding" type="text" value="0"></td>'
	            +                   '<td>间距<input class="edit_table_spacing" type="text" value="0"></td>'
	            +               '</tr>'
	            +               '<tr>'
	            +                   '<td>对齐方式:</td>'
	            +                   '<td>'
	            +                       '<select class="edit_table_justify">'
	            +                            '<option value="0">左对齐</option>'
	            +                            '<option value="1">居中</option>'
	            +                            '<option value="2">右对齐</option>'
	            +                        '</select>'
	            +                  ' </td>'
	            +               '</tr>'
	            +           '</table>'
	            +            '<div>'
	            +                '<button class="btn_mask"  name="insertTable" >ok</button>'
	            +                '<button class="btn_mask"  name="closeTable">cancel</button>'
	            +            '</div>'
	            +        '</div>'

	            ):'')

	            +(_self.xeditBtnConfig.imageBtn?(
	                     '<div class="edit_mask_img none">'
	            +            '<div class="mask_header">图片</div>'
	            +            '<table class="mask_table_img">'
	            +                '<tr>'
	            +                   ' <td>图片地址：</td>'
	            +                    '<td><input class="edit_img_href" type="text" value="http://" style="width:220px"></td>'
	            +                '</tr>'
	            +                '<tr>'
	            +                    '<td>图片大小：</td>'
	            +                    '<td>'
	            +                        '宽<input class="edit_img_width" value="100" type="text" style="width:40px">'
	            +                        '<select class="edit_img_width_unit">'
	            +                            '<option value="1">px</option>'
	            +                            '<option value="0">%</option>'
	            +                        '</select>'
	            +                        '高<input class="edit_img_height" value="100" type="text" style="width:40px" >'
	            +                        '<select class="edit_img_height_unit">'
	            +                            '<option value="1">px</option>'
	            +                            '<option value="0">%</option>'
	            +                       '</select>'
	            +                   '</td>'
	            +                '</tr>'
	            +            '</table>'
	            +            '<div>'
	            +                '<button class="btn_mask" name="insertImg">ok</button>'
	            +                '<button class="btn_mask"  name="closeImg">cancel</button>'
	            +            '</div>'
	            +        '</div>'
	            ):'')
	            
	            +    '</div>'
	            +'</div>'
	            + '<div class="editableText" contenteditable="true" name="getCurrentSelection">'
	            +(_self.xeditBtnConfig.defaultHTML==""?'<div><br/></div>':_self.xeditBtnConfig.defaultHTML)  
	            +'</div> '
	            +'<textarea id="textarea" class="xedit_textarea none"></textarea>'
	        	+'</div>';
	currentDom.innerHTML=xeditHTML;
	var onlyIdSel="#"+onlyId;      	
	_self.xEditDom={
			editContainer:document.querySelector(onlyIdSel),
			editHeader:document.querySelector(onlyIdSel+' .edit_header'),
            editableText:document.querySelector(onlyIdSel+' .editableText'),
            textarea:document.querySelector(onlyIdSel+' .xedit_textarea'),
            colorDropdown:document.querySelector(onlyIdSel+' .color_dropdown'),
            bgColorDropdown:document.querySelector(onlyIdSel+' .bg_color_dropdown'),
            bgColorDropdownTable:document.querySelector(onlyIdSel+' .bg_color_dropdown_table'),
            colorDropdownTable:document.querySelector(onlyIdSel+' .color_dropdown_table'),
            comboboxFontsize:document.querySelector(onlyIdSel+' .combobox_fontsize'),
            fontsizeValue:document.querySelector(onlyIdSel+' .combobox_fontsize_value'),
            comboboxFontfamily:document.querySelector(onlyIdSel+' .combobox_fontfamily'),
            fontfamilyValue:document.querySelector(onlyIdSel+' .fontfamily_value'),
            comboboxParagraph:document.querySelector(onlyIdSel+' .combobox_paragraph'),
            comboboxParagraphValue:document.querySelector(onlyIdSel+' .combobox_paragraph_value'),
            editMask:document.querySelector(onlyIdSel+' .edit_mask'),
            editMaskTable:document.querySelector(onlyIdSel+' .edit_mask_table'),
            editMaskImg:document.querySelector(onlyIdSel+' .edit_mask_img'),
            editTableTr:document.querySelector(onlyIdSel+" .edit_table_tr"),
            editTableTd:document.querySelector(onlyIdSel+" .edit_table_td"),
            editTableWidth:document.querySelector(onlyIdSel+" .edit_table_width"),
            editTableWidthUnit:document.querySelector(onlyIdSel+" .edit_table_width_unit"),
            editTableHeight:document.querySelector(onlyIdSel+" .edit_table_height"),
            editTableHeightUnit:document.querySelector(onlyIdSel+" .edit_table_height_unit"),
            editTablePadding:document.querySelector(onlyIdSel+" .edit_table_padding"),
            editTableSpacing:document.querySelector(onlyIdSel+" .edit_table_spacing"),
            editTableJustify:document.querySelector(onlyIdSel+" .edit_table_justify"),
            editImgHref:document.querySelector(onlyIdSel+" .edit_img_href"),
            editImgWidth:document.querySelector(onlyIdSel+" .edit_img_width"),
            editImgWidthUnit:document.querySelector(onlyIdSel+" .edit_img_width_unit"),
            editImgHeight:document.querySelector(onlyIdSel+" .edit_img_height"),
            editImgHeightUnit:document.querySelector(onlyIdSel+" .edit_img_height_unit"),
		}
}
//初始化文本编辑器
XEditor.prototype.initXEdit=function(options)
{
	this.initxEditContentH();
	this.initIEeditable();
    this.initEditorColorTable('color');
    this.initEditorColorTable('bgcolor');
    this.initFontfamily();
    this.initFontsize();
    this.initParagraph();
    this.initEventListener();
}
//初始化可编辑区域的高度
XEditor.prototype.initxEditContentH=function()
{
		var editContainerHeight=""
		var editHeaderHeight=""
		if(window.getComputedStyle){
	        //优先使用W3C规范
	        editContainerHeight=window.getComputedStyle(this.xEditDom.editContainer)["height"];
	        editHeaderHeight=window.getComputedStyle(this.xEditDom.editHeader)["height"];
	    }else{
	        //针对IE9以下兼容
	        editContainerHeight=this.xEditDom.editContainer.currentStyle["height"];
	        editHeaderHeight=this.xEditDom.editHeader.currentStyle["height"];
	    }
        var height=parseFloat(editContainerHeight)-parseFloat(editHeaderHeight)+"px";
	    
	    this.xEditDom.editableText.style.height=height;
	    this.xEditDom.textarea.style.height=height;
}
//初始化IE浏览器    
XEditor.prototype.initIEeditable=function()
{
	this.isIE()&&(this.xEditDom.editableText.innerHTML=this.xeditBtnConfig.defaultHTML==""?"<div></div>":this.xeditBtnConfig.defaultHTML);
};
//初始化字体颜色选项
XEditor.prototype.initEditorColorTable=function(name)
{
	var colorsLength=this.colors.length;
    var tr=""; 
    tr+="<tr><td colspan='10'>主题颜色</td></tr>";
    var td='';
    for(var i=0;i<this.colors[0].length;i++){
        td+='<td><a href="javascript:void(0)" name="'+name+'" data-color="'+this.colors[0][i]+'" class="edit_colorcell" style="background-color:'+this.colors[0][i]+';border:solid #ccc;border-width:1px;"></a></td>';
    }
    tr+='<tr class="colorpicker_firstrow">'+td+'</tr>';
    td="";
    for(var i=0;i<this.colors[1].length;i++){
        td+='<td><a href="javascript:void(0)" name="'+name+'" data-color="'+this.colors[1][i]+'" class="edit_colorcell" style="background-color:'+this.colors[1][i]+';border:solid #ccc;border-width:1px 1px 0 1px;"></a></td>';
    }
    tr+='<tr>'+td+'</tr>';
    
    for(var j=2;j<colorsLength-1;j++){
        td="";
        for(var i=0;i<this.colors[j].length;i++){
            td+='<td><a href="javascript:void(0)" name="'+name+'" data-color="'+this.colors[j][i]+'" class="edit_colorcell" style="background-color:'+this.colors[j][i]+';border:solid #ccc;border-width:0 1px 0 1px;"></a></td>';
        }
        tr+='<tr>'+td+'</tr>';
    }
    tr+='<tr><td colspan="10">标准颜色</td></tr>';
    td="";
    for(var i=0;i<this.colors[colorsLength-1].length;i++){
        td+='<td><a href="javascript:void(0)" name="'+name+'" data-color="'+this.colors[6][i]+'" class="edit_colorcell" style="background-color:'+this.colors[6][i]+';border:solid #ccc;border-width:1px;"></a></td>';
    }
    tr+='<tr class="colorpicker_firstrow">'+td+'</tr>';
    var colorTable="<table><tbody>"+tr+"</tbody></table>";
    if(name=="color"){
    	this.xEditDom.colorDropdownTable.innerHTML=colorTable;
    }else if(name=="bgcolor"){
    	this.xEditDom.bgColorDropdownTable.innerHTML=colorTable;
    }
};
//初始化字体样式
XEditor.prototype.initFontfamily=function()
{
    var li="";
    for(var i=0;i<this.fontFamilys[0].length;i++){
        li+='<li class="edit_comb_item" data-item-fontfamily-title="'+this.fontFamilys[1][i]+'" name="getFontFamily" data-item-fontfamily="'+this.fontFamilys[0][i]+'" style="font-family:'+this.fontFamilys[0][i]+'">'+this.fontFamilys[1][i]+'</li>'
    }
    this.xEditDom.comboboxFontfamily.innerHTML=li;
};
//初始化字体大小
XEditor.prototype.initFontsize=function()
{
        var li="";
        for(var i=0;i<this.fontsizes[0].length;i++){
            li+='<li class="edit_comb_item" name="getFontSize" data-item-fontsize="'+this.fontsizes[0][i]+'" data-item-index="'+this.fontsizes[1][i]+'" style="font-size: '+this.fontsizes[0][i]+'px;line-height: '+this.fontsizes[0][i]+'px;">'+this.fontsizes[0][i]+'</li>';
        }
        this.xEditDom.comboboxFontsize.innerHTML=li;
};
//初始化段落
XEditor.prototype.initParagraph=function()
{	
    var li="";
    for(var i=0;i<this.paragraphs[0].length;i++){
        li+='<li class="edit_comb_item" name="getParagraph" data-item-paragraph="'+this.paragraphs[0][i]+'" style="font-size: '+this.paragraphs[1][i]+';line-height: '+this.paragraphs[1][i]+';">'+this.paragraphs[0][i]+'</li>';
    }
    this.xEditDom.comboboxParagraph.innerHTML=li;
};
//初始化监听
XEditor.prototype.initEventListener=function()
{
	var _this=this;
    window.addEventListener?(window.addEventListener("click",_this.closeAllDropdown.bind(_this),false)):(window.attachEvent("click",_this.closeAllDropdown.bind(_this)));
},
//初始化事件委托
XEditor.prototype.addAllXEditEvent=function(){
	var xeditor=this.xEditDom.editContainer;
	var editableText=this.xEditDom.editableText;
	var _self=this;
	if(window.addEventListener){
		xeditor.addEventListener('click',function(e){
			_self.EditClickEvent(e);
		},false);
		xeditor.addEventListener('mousedown',function(e){
			_self.EditMousedownEvent(e);
		},true);
		editableText.addEventListener('mouseout',function(e){
			_self.getCurrentSelection(e);
		},true);
	}else{
		xeditor.attachEvent("onclick",function(e){
			_self.EditClickEvent(e);
		})
		xeditor.attachEvent('onmousedown',function(e){
			_self.EditMousedownEvent(e);
		},true);
		editableText.attachEvent('onmouseout',function(e){
			_self.getCurrentSelection(e);
		},true);
	}
}
//鼠标点击事件委托
XEditor.prototype.EditClickEvent=function(event){
	var _self=this;
	var event = event ? event : window.event; 
	var element=event.target|| event.srcElement;
	var btnName=element.getAttribute('name');
	switch(btnName){
		case 'getHTML':
		_self.getHTML(element);
		break;
		case 'unDo':
		_self.unDo(element);
		break;
		case 'reDo':
		_self.reDo(element);
		break;
		case 'setFontBold':
		_self.setFontBold(element);
		break;
		case 'setFontItalic':
		_self.setFontItalic(element);
		break;
		case 'setFontUnderline':
		_self.setFontUnderline(element);
		break;
		case 'setFontStrikeThrough':
		_self.setFontStrikeThrough(element);
		break;
		case 'showFontFamily':
		_self.showFontFamily(element);
		_self.stopPropagation(event);
		break;
		case 'showFontSize':
		_self.showFontSize(element);
		_self.stopPropagation(event);
		break;
		case 'showColor':
		_self.showColor(element);
		_self.stopPropagation(event);
		break;
		case 'showBgColor':
		_self.showBgColor(element);
		_self.stopPropagation(event);
		break;
		case 'getOrderedList':
		_self.getOrderedList(element);
		break;
		case 'getUnorderedList':
		_self.getUnorderedList(element);
		break;
		case 'justifyLeft':
		_self.justifyLeft(element);
		break;
		case 'justifyCenter':
		_self.justifyCenter(element);
		break;
		case 'justifyRight':
		_self.justifyRight(element);
		break;
		case 'showParagraph':
		_self.showParagraph(element);
		_self.stopPropagation(event);
		break;
		case 'createLink':
		_self.createLink(element);
		break;
		case 'unLink':
		_self.unLink(element);
		break;
		case 'showTable':
		_self.showTable(element);
		break;
		case 'closeTable':
		_self.closeTable(element);
		break;
		case 'showImg':
		_self.showImg(element);
		break;
		case 'closeImg':
		_self.closeImg(element);
		break;
		case 'insertTable':
		_self.insertTable(element);
		break;
		case 'insertImg':
		_self.insertImg(element);
		break;
		default:
		break;	
	}
}
//mousedown事件委托
XEditor.prototype.EditMousedownEvent=function(event){
	var _self=this;
	var event = event ? event : window.event; 
	var element=event.target|| event.srcElement;
	var btnName=element.getAttribute('name');
	switch(btnName){		
		case 'getFontFamily':
		_self.getFontFamily(event);
		break;
		case 'getFontSize':
		_self.getFontSize(event);
		break;
		case 'color':
		_self.getColor(event);
		break;
		case 'bgcolor':
		_self.getBgColor(event);
		break;
		case 'getParagraph':
		_self.getParagraph(event);
		break;
		default:
		break;
	}
	_self.stopPropagation(event);
}
//mouseout事件委托
XEditor.prototype.EditMouseoutEvent=function(event){
	var _self=this;
	var event = event ? event : window.event; 
	var element=event.target|| event.srcElement;
	var btnName=element.getAttribute('name');
	if(btnName=="getCurrentSelection"){
		_self.getCurrentSelection();
	}
}
XEditor.prototype.getValue=function()
{
	//this.optionGetValue(this.xEditDom.editableText.innerHTML);
	return this.xEditDom.editableText.innerHTML;
}
//获取html
XEditor.prototype.getHTML=function(element){
    this.toggleClass(element,'btn_active');
    if(this.xEditDom.textarea.getAttribute('class').indexOf('none')>=0){
        this.xEditDom.textarea.value=this.xEditDom.editableText.innerHTML; 
    }
    this.toggleClass(this.xEditDom.textarea,'none');
    this.toggleClass(this.xEditDom.editableText,'none');
    //回调函数
    if(this.optionGetValue){
    	this.optionGetValue(this.getValue());
    } 
};
//撤销
XEditor.prototype.unDo=function(_this){
    document.execCommand('Undo');
    this.toggleClass(_this,'btn_active');
    //回调函数
    if(this.optionGetValue){
    	this.optionGetValue(this.getValue());
    } 
};
//恢复
XEditor.prototype.reDo=function(_this){
    document.execCommand("Redo");
    this.toggleClass(_this,'btn_active');
    //回调函数
    if(this.optionGetValue){
    	this.optionGetValue(this.getValue());
    } 
};
//加粗
XEditor.prototype.setFontBold=function(_this)
{
    document.execCommand('bold',false,null); 
    this.toggleClass(_this,'btn_active');
    //回调函数
    if(this.optionGetValue){
    	this.optionGetValue(this.getValue());
    } 
};
//斜体
XEditor.prototype.setFontItalic=function(_this)
{
    document.execCommand('italic',false,null); 
    this.toggleClass(_this,'btn_active');
    //回调函数
    if(this.optionGetValue){
    	this.optionGetValue(this.getValue());
    } 
};
//下划线
XEditor.prototype.setFontUnderline=function(_this)
{
    document.execCommand('underline',false,null); 
    this.toggleClass(_this,'btn_active');
    //回调函数
    if(this.optionGetValue){
    	this.optionGetValue(this.getValue());
    } 
};
//删除线
XEditor.prototype.setFontStrikeThrough=function(_this)
{
    document.execCommand("StrikeThrough",false,null);
    this.toggleClass(_this,'btn_active');
    //回调函数
    if(this.optionGetValue){
    	this.optionGetValue(this.getValue());
    } 
};
//字体样式下拉框
XEditor.prototype.showFontFamily=function(event)
{
    this.closeAllDropdown();
    this.toggleClass(this.xEditDom.comboboxFontfamily,'none');
    this.setCurrentSelection();
};
//字体样式
XEditor.prototype.getFontFamily=function(event)
{
    var event = event ? event : window.event; 
    var obj = event.srcElement ? event.srcElement : event.target;
    this.stopPropagation(event); 
    if(obj.tagName=="LI"){
       var itemFontfamily=obj.getAttribute('data-item-fontfamily');
       var itemFontfamilyTitle=obj.getAttribute('data-item-fontfamily-title');
        this.xEditDom.fontfamilyValue.innerHTML=itemFontfamilyTitle;
        document.execCommand("fontname",false,itemFontfamily); 
        this.toggleClass(this.xEditDom.comboboxFontfamily,'none');
        //回调函数
        if(this.optionGetValue){
	    	this.optionGetValue(this.getValue());
	    } 
    }
};
//字体大小下拉框
XEditor.prototype.showFontSize=function(event)
{
    this.stopPropagation(event);
    this.closeAllDropdown();
    this.toggleClass(this.xEditDom.comboboxFontsize,'none');
    this.setCurrentSelection();
};
//字体大小
XEditor.prototype.getFontSize=function(event)
{
    var event = event ? event : window.event; 
    var obj = event.srcElement ? event.srcElement : event.target;
    this.stopPropagation(event); 
   if(obj.tagName=="LI"){
        var itemIndex=obj.getAttribute('data-item-index');
        var itemFontSize=obj.getAttribute('data-item-fontsize')
        this.xEditDom.fontsizeValue.innerHTML=itemFontSize;
        this.setCurrentSelection();
        document.execCommand("FontSize",false,itemIndex);
        this.toggleClass(this.xEditDom.comboboxFontsize,'none');
        //回调函数
        if(this.optionGetValue){
	    	this.optionGetValue(this.getValue());
	    } 
    }
};
//打开颜色下拉框
XEditor.prototype.showColor=function(event)
{
	this.stopPropagation(event);
	this.closeAllDropdown();
    this.toggleClass(this.xEditDom.colorDropdown,'none');
	this.setCurrentSelection();
};
//字体颜色
XEditor.prototype.getColor=function(event)
{ 
    var event = event ? event : window.event; 
    var obj = event.srcElement ? event.srcElement : event.target; 
    if(obj.tagName=="A"){
        var color=obj.getAttribute('data-color');
        document.execCommand("forecolor",false,color); 
        this.toggleClass(this.xEditDom.colorDropdown,'none');
        //回调函数
        if(this.optionGetValue){
	    	this.optionGetValue(this.getValue());
	    } 
    }
};
//打开背景颜色下拉框
XEditor.prototype.showBgColor=function(event)
{
    this.stopPropagation(event);
    this.closeAllDropdown();
    this.toggleClass(this.xEditDom.bgColorDropdown,'none');
    this.setCurrentSelection(); 
};
//背景颜色
XEditor.prototype.getBgColor=function(event)
{
    var event = event ? event : window.event; 
    var obj = event.srcElement ? event.srcElement : event.target; 
    if(obj.tagName=="A"){
        var color=obj.getAttribute('data-color');
        document.execCommand("BackColor",false,color);
        this.toggleClass(this.xEditDom.bgColorDropdown,'none');
        //回调函数
        if(this.optionGetValue){
	    	this.optionGetValue(this.getValue());
	    } 
    }
};
//有序列表
XEditor.prototype.getOrderedList=function(_this)
{
    this.setCurrentSelection();
    document.execCommand("InsertOrderedList",false,null);
    this.toggleClass(_this,'btn_active');
    //回调函数
    if(this.optionGetValue){
    	this.optionGetValue(this.getValue());
    } 
};
//无序列表
XEditor.prototype.getUnorderedList=function(_this)
{
    this.setCurrentSelection();
    document.execCommand("InsertUnorderedList",false,null);
    this.toggleClass(_this,'btn_active');
    //回调函数
    if(this.optionGetValue){
    	this.optionGetValue(this.getValue());
    } 
};
//左对齐
XEditor.prototype.justifyLeft=function(_this)
{
    this.setCurrentSelection();
    document.execCommand("JustifyLeft",false,null);
    this.toggleClass(_this,'btn_active'); 
    //回调函数
    if(this.optionGetValue){
    	this.optionGetValue(this.getValue());
    } 
};
//居中对齐
XEditor.prototype.justifyCenter=function(_this)
{
    this.setCurrentSelection();
     document.execCommand("JustifyCenter",false,null);
     this.toggleClass(_this,'btn_active');
     //回调函数
    if(this.optionGetValue){
    	this.optionGetValue(this.getValue());
    } 
};
//右对齐
XEditor.prototype.justifyRight=function(_this)
{
    this.setCurrentSelection();
     document.execCommand("JustifyRight",false,null);
     this.toggleClass(_this,'btn_active'); 
     //回调函数
    if(this.optionGetValue){
    	this.optionGetValue(this.getValue());
    } 
};
//段落格式下拉框
XEditor.prototype.showParagraph=function(event)
{
    this.setCurrentSelection();
    this.stopPropagation(event);
    this.closeAllDropdown();
    this.toggleClass(this.xEditDom.comboboxParagraph,'none');
};
//段落格式
XEditor.prototype.getParagraph=function(event)
{
    var event = event ? event : window.event; 
    var obj = event.srcElement ? event.srcElement : event.target;
    this.stopPropagation(event); 
    if(obj.tagName=="LI"){
        var itemParagraph=obj.getAttribute('data-item-paragraph')
        this.xEditDom.comboboxParagraphValue.innerHTML=itemParagraph;
        document.execCommand('FormatBlock',false,itemParagraph)
        this.toggleClass(this.xEditDom.comboboxParagraph,'none');
        //回调函数
        if(this.optionGetValue){
	    	this.optionGetValue(this.getValue());
	    } 
    }
};
//创建链接
XEditor.prototype.createLink=function(_this)
{
    this.toggleClass(_this,'btn_active');
    var linkURL = prompt('Enter a URL:', 'http://');
    document.execCommand('CreateLink', false, linkURL);
    //回调函数
    if(this.optionGetValue){
    	this.optionGetValue(this.getValue());
    } 
};
//取消链接
XEditor.prototype.unLink=function(_this)
{
    this.toggleClass(_this,'btn_active');
    document.execCommand('Unlink', false, null);
    //回调函数
    if(this.optionGetValue){
    	this.optionGetValue(this.getValue());
    } 
};
//显示表格弹出框
XEditor.prototype.showTable=function()
{
    if(this.isIE()){
        this.getCurrentSelection();
    }
    this.toggleClass(this.xEditDom.editMask,'none');
    this.toggleClass(this.xEditDom.editMaskTable,'none');
};
//关闭弹出框
XEditor.prototype.closeTable=function()
{
    this.toggleClass(this.xEditDom.editMask,'none');
    this.toggleClass(this.xEditDom.editMaskTable,'none');
};
//插入表格
XEditor.prototype.insertTable=function()
{
    var trtdUnit=['%','px'];
    var justifyConfig=['left','center','right'];
    var editTableTr=this.xEditDom.editTableTr.value;
    var editTableTd=this.xEditDom.editTableTd.value;
    var editTableWidth=this.xEditDom.editTableWidth.value+trtdUnit[this.xEditDom.editTableWidthUnit.value];
    var editTableHeight=this.xEditDom.editTableHeight.value+trtdUnit[this.xEditDom.editTableHeightUnit.value];
    var editTablePadding=this.xEditDom.editTablePadding.value;
    var editTableSpacing=this.xEditDom.editTableSpacing.value;
    var editTableJustify=justifyConfig[this.xEditDom.editTableJustify.value];

    var Table1="<table border='1'  width='"+editTableWidth+"' height='"+editTableHeight+"' cellspacing='"+editTableSpacing+"' cellpadding='"+editTablePadding+"' align='"+editTableJustify+"'>";
    var TableTd="";
    for(var i=0;i<editTableTd;i++){
        TableTd+="<td><br/></td>"
    }
    var TableTr="";
    for(var j=0;j<editTableTr;j++){
        TableTr+="<tr>"+TableTd+"</tr>";
    }
    var Table2="</table>";
    var tableString=Table1+TableTr+Table2;
    if(this.isIE()){
        this.setCurrentSelection();
        var newRange = document.selection.createRange(); 
        // 注意，此处必须创建一个新的选区，在原来的 
        newRange.pasteHTML(tableString);
    }else{
        this.xEditDom.editableText.focus();
       document.execCommand('insertHTML', false, tableString); 
    }
    this.toggleClass(this.xEditDom.editMask,'none');
    this.toggleClass(this.xEditDom.editMaskTable,'none');
    //回调函数
    if(this.xeditBtnConfig.getHTMLFn){
    	this.xeditBtnConfig.getHTMLFn(this.getValue());
    }
};
//显示插入图片弹出框
XEditor.prototype.showImg=function()
{
    this.toggleClass(this.xEditDom.editMask,'none');
    this.toggleClass(this.xEditDom.editMaskImg,'none');
};
//插入图片
XEditor.prototype.insertImg=function()
{
    if(this.isIE()){
        this.getCurrentSelection();
    }
    var trtdUnit=['%','px']
    var editImgHref=this.xEditDom.editImgHref.value;
    var editImgWidth=this.xEditDom.editImgWidth.value+trtdUnit[this.xEditDom.editImgWidthUnit.value];
    var editImgHeight=this.xEditDom.editImgHeight.value+trtdUnit[this.xEditDom.editImgHeightUnit.value];
    var imgHtml="<img src='"+editImgHref+"' style='width:"+editImgWidth+";height:"+editImgHeight+"' />";

     if(this.isIE()){
        this.setCurrentSelection();
        var newRange = document.selection.createRange(); 
        // 注意，此处必须创建一个新的选区，在原来的 
        newRange.pasteHTML(imgHtml);
    }else{
        this.xEditDom.editableText.focus();
        document.execCommand('insertHTML', false,imgHtml);
    }        
    this.toggleClass(this.xEditDom.editMask,'none');
    this.toggleClass(this.xEditDom.editMaskImg,'none');
    //回调函数
    if(this.optionGetValue){
    	this.optionGetValue(this.getValue());
    } 
};
//关闭图片弹出框
XEditor.prototype.closeImg=function()
{
    this.toggleClass(this.xEditDom.editMask,'none');
    this.toggleClass(this.xEditDom.editMaskImg,'none');
};
//获取当前选区
XEditor.prototype.getCurrentSelection=function()
{
    var selection = window.getSelection ? window.getSelection() : document.selection;
    if (!selection.rangeCount) return;
    var range = selection.createRange ? selection.createRange() : selection.getRangeAt(0);
    this.xEditRange=range;
};
//设置当前选区
XEditor.prototype.setCurrentSelection=function()
{
    var selection = window.getSelection();
    if(!this.xEditRange){
        return;
    }
    this.xEditCurrentRange=this.xEditRange;
     var newRange = document.createRange(); // 注意，此处必须创建一个新的选区，在原来的 range 上修改无效
    newRange.setStart(this.xEditCurrentRange.startContainer, this.xEditCurrentRange.startOffset);
    newRange.setEnd(this.xEditCurrentRange.endContainer, this.xEditCurrentRange.endOffset);
    // 恢复选区
    selection.removeAllRanges();
    selection.addRange(newRange);
};
//阻止冒泡
XEditor.prototype.stopPropagation=function(e) 
{ 
    if (e.stopPropagation){
    	e.stopPropagation();
    }else{
    	e.cancelBubble = true; 
    }       
};
//切换样式
XEditor.prototype.toggleClass=function(obj,className)
{
    var this_class=obj.getAttribute('class');
    var className2=" "+className;
    if(this_class.indexOf(className)>=0){
        var classes=this_class.replace(className2,"").replace(className,"");
    }else{
        var classes=this_class.concat(className2);
    }
    obj.setAttribute('class',classes);
    new_class=obj.getAttribute('class');
    if(new_class.indexOf(className)>=0 && className=="btn_active"){
    	var _this=this;
        setTimeout(function(){
            _this.toggleClass(obj,className)
        },500)
    }
};
//关闭所有下拉框
XEditor.prototype.closeAllDropdown=function()
{
    if(this.xEditDom.colorDropdown.getAttribute('class').indexOf('none')==-1){
        this.toggleClass(this.xEditDom.colorDropdown,'none');
    }
    if(this.xEditDom.bgColorDropdown.getAttribute('class').indexOf('none')==-1){
        this.toggleClass(this.xEditDom.bgColorDropdown,'none');
    }
    if(this.xEditDom.comboboxFontsize.getAttribute('class').indexOf('none')==-1){
        this.toggleClass(this.xEditDom.comboboxFontsize,'none');
    }
    if(this.xEditDom.comboboxFontfamily.getAttribute('class').indexOf('none')==-1){
        this.toggleClass(this.xEditDom.comboboxFontfamily,'none');
    }
    if(this.xEditDom.comboboxParagraph.getAttribute('class').indexOf('none')==-1){
        this.toggleClass(this.xEditDom.comboboxParagraph,'none');
    }
};
//获取唯一id
XEditor.prototype.getuuid=function() 
{
    function S4() {
       return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    }
    return (S4()+S4()+"_"+S4()+"_"+S4()+"_"+S4()+"_"+S4()+S4()+S4());
}
//判断是否是ie浏览器
XEditor.prototype.isIE=function()
{
	var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
    if (userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1) {
        return true;
    }; //判断是否IE浏览器
    return false;
};

