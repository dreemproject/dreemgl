/* Copyright 2015 Teem2 LLC. Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.  
   You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0 Unless required by applicable law or agreed to in writing, 
   software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, 
   either express or implied. See the License for the specific language governing permissions and limitations under the License.*/
// parse a color string into a [r,g,b] 0-1 float array

define(function(require, exports){
	var color_wikipedia = {
		acidgreen:0xffB0BF1A,aero:0xff7CB9E8,aeroblue:0xffC9FFE5,africanviolet:0xffB284BE,airforceblueraf:0xff5D8AA8,airforceblueusaf:0xff00308F,
		airsuperiorityblue:0xff72A0C1,alabamacrimson:0xffAF002A,aliceblue:0xffF0F8FF,alizarincrimson:0xffE32636,alloyorange:0xffC46210,
		almond:0xffEFDECD,amaranth:0xffE52B50,amaranthpink:0xffF19CBB,amaranthpurple:0xffAB274F,amaranthred:0xffD3212D,amazon:0xff3B7A57,
		amber:0xffFFBF00,ambersaeece:0xffFF7E00,americanrose:0xffFF033E,amethyst:0xff9966CC,androidgreen:0xffA4C639,antiflashwhite:0xffF2F3F4,
		antiquebrass:0xffCD9575,antiquebronze:0xff665D1E,antiquefuchsia:0xff915C83,antiqueruby:0xff841B2D,antiquewhite:0xffFAEBD7,aoenglish:0xff008000,
		applegreen:0xff8DB600,apricot:0xffFBCEB1,aqua:0xff00FFFF,aquamarine:0xff7FFFD4,armygreen:0xff4B5320,artichoke:0xff8F9779,arylideyellow:0xffE9D66B,
		ashgrey:0xffB2BEB5,asparagus:0xff87A96B,atomictangerine:0xffFF9966,auburn:0xffA52A2A,aureolin:0xffFDEE00,aurometalsaurus:0xff6E7F80,
		avocado:0xff568203,azure:0xff007FFF,azurecolor:0xffF0FFFF,azuremist:0xffF0FFFF,azureishwhite:0xffDBE9F4,babyblue:0xff89CFF0,babyblueeyes:0xffA1CAF1,
		babypink:0xffF4C2C2,babypowder:0xffFEFEFA,bakermillerpink:0xffFF91AF,ballblue:0xff21ABCD,bananamania:0xffFAE7B5,bananayellow:0xffFFE135,
		bangladeshgreen:0xff006A4E,barbiepink:0xffE0218A,barnred:0xff7C0A02,battleshipgrey:0xff848482,bazaar:0xff98777B,beaublue:0xffBCD4E6,
		beaver:0xff9F8170,beige:0xffF5F5DC,bdazzledblue:0xff2E5894,bigdiporuby:0xff9C2542,bisque:0xffFFE4C4,bistre:0xff3D2B1F,bistrebrown:0xff967117,
		bitterlemon:0xffCAE00D,bitterlime:0xffBFFF00,bittersweet:0xffFE6F5E,bittersweetshimmer:0xffBF4F51,black:0xff000000,blackbean:0xff3D0C02,
		blackleatherjacket:0xff253529,blackolive:0xff3B3C36,blanchedalmond:0xffFFEBCD,blastoffbronze:0xffA57164,bleudefrance:0xff318CE7,
		blizzardblue:0xffACE5EE,blond:0xffFAF0BE,blue:0xff0000FF,bluecrayola:0xff1F75FE,bluemunsell:0xff0093AF,bluencs:0xff0087BD,bluepantone:0xff0018A8,
		bluepigment:0xff333399,blueryb:0xff0247FE,bluebell:0xffA2A2D0,bluegray:0xff6699CC,bluegreen:0xff0D98BA,bluemagentaviolet:0xff553592,
		bluesapphire:0xff126180,blueviolet:0xff8A2BE2,blueyonder:0xff5072A7,blueberry:0xff4F86F7,bluebonnet:0xff1C1CF0,blush:0xffDE5D83,
		bole:0xff79443B,bondiblue:0xff0095B6,bone:0xffE3DAC9,bostonuniversityred:0xffCC0000,bottlegreen:0xff006A4E,boysenberry:0xff873260,
		brandeisblue:0xff0070FF,brass:0xffB5A642,brickred:0xffCB4154,brightcerulean:0xff1DACD6,brightgreen:0xff66FF00,brightlavender:0xffBF94E4,
		brightlilac:0xffD891EF,brightmaroon:0xffC32148,brightnavyblue:0xff1974D2,brightpink:0xffFF007F,brightturquoise:0xff08E8DE,brightube:0xffD19FE8,
		brilliantazure:0xff3399FF,brilliantlavender:0xffF4BBFF,brilliantrose:0xffFF55A3,brinkpink:0xffFB607F,britishracinggreen:0xff004225,
		bronze:0xffCD7F32,bronzeyellow:0xff737000,browntraditional:0xff964B00,brown:0xffA52A2A,brownnose:0xff6B4423,brunswickgreen:0xff1B4D3E,
		bubblegum:0xffFFC1CC,bubbles:0xffE7FEFF,buff:0xffF0DC82,budgreen:0xff7BB661,bulgarianrose:0xff480607,burgundy:0xff800020,burlywood:0xffDEB887,
		burntorange:0xffCC5500,burntsienna:0xffE97451,burntumber:0xff8A3324,byzantine:0xffBD33A4,byzantium:0xff702963,cadet:0xff536872,
		cadetblue:0xff5F9EA0,cadetgrey:0xff91A3B0,cadmiumgreen:0xff006B3C,cadmiumorange:0xffED872D,cadmiumred:0xffE30022,cadmiumyellow:0xffFFF600,
		cafeaulait:0xffA67B5B,cafenoir:0xff4B3621,calpolypomonagreen:0xff1E4D2B,cambridgeblue:0xffA3C1AD,camel:0xffC19A6B,cameopink:0xffEFBBCC,
		camouflagegreen:0xff78866B,canaryyellow:0xffFFEF00,candyapplered:0xffFF0800,candypink:0xffE4717A,capri:0xff00BFFF,caputmortuum:0xff592720,
		cardinal:0xffC41E3A,caribbeangreen:0xff00CC99,carmine:0xff960018,carminemp:0xffD70040,carminepink:0xffEB4C42,carminered:0xffFF0038,
		carnationpink:0xffFFA6C9,carnelian:0xffB31B1B,carolinablue:0xff56A0D3,carrotorange:0xffED9121,castletongreen:0xff00563F,catalinablue:0xff062A78,
		catawba:0xff703642,cedarchest:0xffC95A49,ceil:0xff92A1CF,celadon:0xffACE1AF,celadonblue:0xff007BA7,celadongreen:0xff2F847C,celeste:0xffB2FFFF,
		celestialblue:0xff4997D0,cerise:0xffDE3163,cerisepink:0xffEC3B83,cerulean:0xff007BA7,ceruleanblue:0xff2A52BE,ceruleanfrost:0xff6D9BC3,
		cgblue:0xff007AA5,cgred:0xffE03C31,chamoisee:0xffA0785A,champagne:0xffF7E7CE,charcoal:0xff36454F,charlestongreen:0xff232B2B,charmpink:0xffE68FAC,
		chartreusetraditional:0xffDFFF00,chartreuse:0xff7FFF00,cherry:0xffDE3163,cherryblossompink:0xffFFB7C5,chestnut:0xff954535,chinapink:0xffDE6FA1,
		chinarose:0xffA8516E,chinesered:0xffAA381E,chineseviolet:0xff856088,chocolatetraditional:0xff7B3F00,chocolate:0xffD2691E,chromeyellow:0xffFFA700,
		cinereous:0xff98817B,cinnabar:0xffE34234,cinnamon:0xffD2691E,citrine:0xffE4D00A,citron:0xff9FA91F,claret:0xff7F1734,classicrose:0xffFBCCE7,
		cobalt:0xff0047AB,cocoabrown:0xffD2691E,coconut:0xff965A3E,coffee:0xff6F4E37,columbiablue:0xffC4D8E2,congopink:0xffF88379,coolblack:0xff000000,
		coolgrey:0xff8C92AC,copper:0xffB87333,coppercrayola:0xffDA8A67,copperpenny:0xffAD6F69,copperred:0xffCB6D51,copperrose:0xff996666,
		coquelicot:0xffFF3800,coral:0xffFF7F50,coralpink:0xffF88379,coralred:0xffFF4040,cordovan:0xff893F45,corn:0xffFBEC5D,cornellred:0xffB31B1B,
		cornflowerblue:0xff6495ED,cornsilk:0xffFFF8DC,cosmiclatte:0xffFFF8E7,coyotebrown:0xff81613e,cottoncandy:0xffFFBCD9,cream:0xffFFFDD0,
		crimson:0xffDC143C,crimsonglory:0xffBE0032,crimsonred:0xff990000,cyan:0xff00FFFF,cyanazure:0xff4E82b4,cyancobaltblue:0xff28589C,
		cyancornflowerblue:0xff188BC2,cyanprocess:0xff00B7EB,cybergrape:0xff58427C,cyberyellow:0xffFFD300,daffodil:0xffFFFF31,dandelion:0xffF0E130,
		darkblue:0xff00008B,darkbluegray:0xff666699,darkbrown:0xff654321,darkbyzantium:0xff5D3954,darkcandyapplered:0xffA40000,darkcerulean:0xff08457E,
		darkchestnut:0xff986960,darkcoral:0xffCD5B45,darkcyan:0xff008B8B,darkelectricblue:0xff536878,darkgoldenrod:0xffB8860B,darkgrayx11:0xffA9A9A9,
		darkgreen:0xff013220,darkgreenx11:0xff006400,darkimperialblue:0xff00416A,darkjunglegreen:0xff1A2421,darkkhaki:0xffBDB76B,darklava:0xff483C32,
		darklavender:0xff734F96,darkliver:0xff534B4F,darkliverhorses:0xff543D37,darkmagenta:0xff8B008B,darkmediumgray:0xffA9A9A9,darkmidnightblue:0xff003366,
		darkmossgreen:0xff4A5D23,darkolivegreen:0xff556B2F,darkorange:0xffFF8C00,darkorchid:0xff9932CC,darkpastelblue:0xff779ECB,darkpastelgreen:0xff03C03C,
		darkpastelpurple:0xff966FD6,darkpastelred:0xffC23B22,darkpink:0xffE75480,darkpowderblue:0xff003399,darkpuce:0xff4F3A3C,darkraspberry:0xff872657,
		darkred:0xff8B0000,darksalmon:0xffE9967A,darkscarlet:0xff560319,darkseagreen:0xff8FBC8F,darksienna:0xff3C1414,darkskyblue:0xff8CBED6,
		darkslateblue:0xff483D8B,darkslategray:0xff2F4F4F,darkspringgreen:0xff177245,darktan:0xff918151,darktangerine:0xffFFA812,darktaupe:0xff483C32,
		darkterracotta:0xffCC4E5C,darkturquoise:0xff00CED1,darkvanilla:0xffD1BEA8,darkviolet:0xff9400D3,darkyellow:0xff9B870C,dartmouthgreen:0xff00703C,
		davysgrey:0xff555555,debianred:0xffD70A53,deepcarmine:0xffA9203E,deepcarminepink:0xffEF3038,deepcarrotorange:0xffE9692C,deepcerise:0xffDA3287,
		deepchampagne:0xffFAD6A5,deepchestnut:0xffB94E48,deepcoffee:0xff704241,deepfuchsia:0xffC154C1,deepgreen:0xff056608,deepgreencyanturquoise:0xff0E7C61,
		deepjunglegreen:0xff004B49,deeplemon:0xffF5C71A,deeplilac:0xff9955BB,deepmagenta:0xffCC00CC,deepmauve:0xffD473D4,deepmossgreen:0xff355E3B,
		deeppeach:0xffFFCBA4,deeppink:0xffFF1493,deeppuce:0xffA95C68,deepruby:0xff843F5B,deepsaffron:0xffFF9933,deepskyblue:0xff00BFFF,
		deepspacesparkle:0xff4A646C,deepspringbud:0xff556B2F,deeptaupe:0xff7E5E60,deeptuscanred:0xff66424D,deer:0xffBA8759,denim:0xff1560BD,
		desaturatedcyan:0xff669999,desert:0xffC19A6B,desertsand:0xffEDC9AF,desire:0xffEA3C53,diamond:0xffB9F2FF,dimgray:0xff696969,dirt:0xff9B7653,
		dodgerblue:0xff1E90FF,dogwoodrose:0xffD71868,dollarbill:0xff85BB65,donkeybrown:0xff664C28,drab:0xff967117,dukeblue:0xff00009C,duststorm:0xffE5CCC9,
		dutchwhite:0xffEFDFBB,earthyellow:0xffE1A95F,ebony:0xff555D50,ecru:0xffC2B280,eerieblack:0xff1B1B1B,eggplant:0xff614051,eggshell:0xffF0EAD6,
		egyptianblue:0xff1034A6,electricblue:0xff7DF9FF,electriccrimson:0xffFF003F,electriccyan:0xff00FFFF,electricgreen:0xff00FF00,electricindigo:0xff6F00FF,
		electriclavender:0xffF4BBFF,electriclime:0xffCCFF00,electricpurple:0xffBF00FF,electricultramarine:0xff3F00FF,electricviolet:0xff8F00FF,
		electricyellow:0xffFFFF33,emerald:0xff50C878,eminence:0xff6C3082,englishgreen:0xff1B4D3E,englishlavender:0xffB48395,englishred:0xffAB4B52,
		englishviolet:0xff563C5C,etonblue:0xff96C8A2,eucalyptus:0xff44D7A8,fallow:0xffC19A6B,falured:0xff801818,fandango:0xffB53389,fandangopink:0xffDE5285,
		fashionfuchsia:0xffF400A1,fawn:0xffE5AA70,feldgrau:0xff4D5D53,feldspar:0xffFDD5B1,ferngreen:0xff4F7942,ferrarired:0xffFF2800,fielddrab:0xff6C541E,
		firebrick:0xffB22222,fireenginered:0xffCE2029,flame:0xffE25822,flamingopink:0xffFC8EAC,flattery:0xff6B4423,flavescent:0xffF7E98E,
		flax:0xffEEDC82,flirt:0xffA2006D,floralwhite:0xffFFFAF0,fluorescentorange:0xffFFBF00,fluorescentpink:0xffFF1493,fluorescentyellow:0xffCCFF00,
		folly:0xffFF004F,forestgreentraditional:0xff014421,forestgreen:0xff228B22,frenchbeige:0xffA67B5B,frenchbistre:0xff856D4D,frenchblue:0xff0072BB,
		frenchfuchsia:0xffFD3F92,frenchlilac:0xff86608E,frenchlime:0xff9EFD38,frenchmauve:0xffD473D4,frenchpink:0xffFD6C9E,frenchplum:0xff811453,
		frenchpuce:0xff4E1609,frenchraspberry:0xffC72C48,frenchrose:0xffF64A8A,frenchskyblue:0xff77B5FE,frenchviolet:0xff8806CE,frenchwine:0xffAC1E44,
		freshair:0xffA6E7FF,fuchsia:0xffFF00FF,fuchsiacrayola:0xffC154C1,fuchsiapink:0xffFF77FF,fuchsiapurple:0xffCC397B,fuchsiarose:0xffC74375,
		fulvous:0xffE48400,fuzzywuzzy:0xffCC6666,gainsboro:0xffDCDCDC,gamboge:0xffE49B0F,gambogeorangebrown:0xff996600,genericviridian:0xff007F66,
		ghostwhite:0xffF8F8FF,giantsorange:0xffFE5A1D,ginger:0xffB06500,glaucous:0xff6082B6,glitter:0xffE6E8FA,gogreen:0xff00AB66,goldmetallic:0xffD4AF37,
		goldgolden:0xffFFD700,goldfusion:0xff85754E,goldenbrown:0xff996515,goldenpoppy:0xffFCC200,goldenyellow:0xffFFDF00,goldenrod:0xffDAA520,
		grannysmithapple:0xffA8E4A0,grape:0xff6F2DA8,gray:0xff808080,grayx11:0xffBEBEBE,grayasparagus:0xff465945,
		grayblue:0xff8C92AC,greencolorwheelx11green:0xff00FF00,greencrayola:0xff1CAC78,green:0xff008000,greenmunsell:0xff00A877,
		greenncs:0xff009F6B,greenpantone:0xff00AD43,greenpigment:0xff00A550,greenryb:0xff66B032,greenyellow:0xffADFF2F,grizzly:0xff885818,
		grullo:0xffA99A86,guppiegreen:0xff00FF7F,halayaube:0xff663854,hanblue:0xff446CCF,hanpurple:0xff5218FA,hansayellow:0xffE9D66B,harlequin:0xff3FFF00,
		harlequingreen:0xff46CB18,harvardcrimson:0xffC90016,harvestgold:0xffDA9100,heartgold:0xff808000,heliotrope:0xffDF73FF,heliotropegray:0xffAA98A9,
		heliotropemagenta:0xffAA00BB,hollywoodcerise:0xffF400A1,honeydew:0xffF0FFF0,honolulublue:0xff006DB0,hookersgreen:0xff49796B,hotmagenta:0xffFF1DCE,
		hotpink:0xffFF69B4,huntergreen:0xff355E3B,iceberg:0xff71A6D2,icterine:0xffFCF75E,illuminatingemerald:0xff319177,imperial:0xff602F6B,
		imperialblue:0xff002395,imperialpurple:0xff66023C,imperialred:0xffED2939,inchworm:0xffB2EC5D,independence:0xff4C516D,indiagreen:0xff138808,
		indianred:0xffCD5C5C,indianyellow:0xffE3A857,indigo:0xff6F00FF,indigodye:0xff091F92,indigo:0xff4B0082,internationalkleinblue:0xff002FA7,
		internationalorangeaerospace:0xffFF4F00,internationalorangeengineering:0xffBA160C,internationalorangegoldengatebridge:0xffC0362C,
		iris:0xff5A4FCF,irresistible:0xffB3446C,isabelline:0xffF4F0EC,islamicgreen:0xff009000,italianskyblue:0xffB2FFFF,ivory:0xffFFFFF0,
		jade:0xff00A86B,japanesecarmine:0xff9D2933,japaneseindigo:0xff264348,japaneseviolet:0xff5B3256,jasmine:0xffF8DE7E,jasper:0xffD73B3E,
		jazzberryjam:0xffA50B5E,jellybean:0xffDA614E,jet:0xff343434,jonquil:0xffF4CA16,jordyblue:0xff8AB9F1,junebud:0xffBDDA57,junglegreen:0xff29AB87,
		kellygreen:0xff4CBB17,kenyancopper:0xff7C1C05,keppel:0xff3AB09E,khaki:0xffC3B091,jawad:0xffC3B091,lightkhaki:0xffF0E68C,
		kobe:0xff882D17,kobi:0xffE79FC4,kombugreen:0xff354230,kucrimson:0xffE8000D,lasallegreen:0xff087830,languidlavender:0xffD6CADD,lapislazuli:0xff26619C,
		laserlemon:0xffFFFF66,laurelgreen:0xffA9BA9D,lava:0xffCF1020,lavenderfloral:0xffB57EDC,lavender:0xffE6E6FA,lavenderblue:0xffCCCCFF,
		lavenderblush:0xffFFF0F5,lavendergray:0xffC4C3D0,lavenderindigo:0xff9457EB,lavendermagenta:0xffEE82EE,lavendermist:0xffE6E6FA,
		lavenderpink:0xffFBAED2,lavenderpurple:0xff967BB6,lavenderrose:0xffFBA0E3,lawngreen:0xff7CFC00,lemon:0xffFFF700,lemonchiffon:0xffFFFACD,
		lemoncurry:0xffCCA01D,lemonglacier:0xffFDFF00,lemonlime:0xffE3FF00,lemonmeringue:0xffF6EABE,lemonyellow:0xffFFF44F,lenurple:0xffBA93D8,
		licorice:0xff1A1110,liberty:0xff545AA7,lightapricot:0xffFDD5B1,lightblue:0xffADD8E6,lightbrown:0xffB5651D,lightcarminepink:0xffE66771,
		lightcoral:0xffF08080,lightcornflowerblue:0xff93CCEA,lightcrimson:0xffF56991,lightcyan:0xffE0FFFF,lightdeeppink:0xffFF5CCD,lightfrenchbeige:0xffC8AD7F,
		lightfuchsiapink:0xffF984EF,lightgoldenrodyellow:0xffFAFAD2,lightgray:0xffD3D3D3,lightgrayishmagenta:0xffCC99CC,lightgreen:0xff90EE90,
		lighthotpink:0xffFFB3DE,lightkhaki:0xffF0E68C,lightmediumorchid:0xffD39BCB,lightmossgreen:0xffADDFAD,lightorchid:0xffE6A8D7,lightpastelpurple:0xffB19CD9,
		lightpink:0xffFFB6C1,lightredochre:0xffE97451,lightsalmon:0xffFFA07A,lightsalmonpink:0xffFF9999,lightseagreen:0xff20B2AA,lightskyblue:0xff87CEFA,
		lightslategray:0xff778899,lightsteelblue:0xffB0C4DE,lighttaupe:0xffB38B6D,lightthulianpink:0xffE68FAC,lightyellow:0xffFFFFE0,lilac:0xffC8A2C8,
		limecolorwheel:0xffBFFF00,limex11green:0xff00FF00,limegreen:0xff32CD32,limerick:0xff9DC209,lincolngreen:0xff195905,linen:0xffFAF0E6,
		lion:0xffC19A6B,liseranpurple:0xffDE6FA1,littleboyblue:0xff6CA0DC,liver:0xff674C47,liverdogs:0xffB86D29,liverorgan:0xff6C2E1F,liverchestnut:0xff987456,
		livid:0xff6699CC,lumber:0xffFFE4CD,lust:0xffE62020,magenta:0xffFF00FF,magentacrayola:0xffFF55A3,magentadye:0xffCA1F7B,magentapantone:0xffD0417E,
		magentaprocess:0xffFF0090,magentahaze:0xff9F4576,magentapink:0xffCC338B,magicmint:0xffAAF0D1,magnolia:0xffF8F4FF,mahogany:0xffC04000,
		maize:0xffFBEC5D,majorelleblue:0xff6050DC,malachite:0xff0BDA51,manatee:0xff979AAA,mangotango:0xffFF8243,mantis:0xff74C365,mardigras:0xff880085,
		marooncrayola:0xffC32148,maroon:0xff800000,maroonx11:0xffB03060,mauve:0xffE0B0FF,mauvetaupe:0xff915F6D,mauvelous:0xffEF98AA,
		maygreen:0xff4C9141,mayablue:0xff73C2FB,meatbrown:0xffE5B73B,mediumaquamarine:0xff66DDAA,mediumblue:0xff0000CD,mediumcandyapplered:0xffE2062C,
		mediumcarmine:0xffAF4035,mediumchampagne:0xffF3E5AB,mediumelectricblue:0xff035096,mediumjunglegreen:0xff1C352D,mediumlavendermagenta:0xffDDA0DD,
		mediumorchid:0xffBA55D3,mediumpersianblue:0xff0067A5,mediumpurple:0xff9370DB,mediumredviolet:0xffBB3385,mediumruby:0xffAA4069,
		mediumseagreen:0xff3CB371,mediumskyblue:0xff80DAEB,mediumslateblue:0xff7B68EE,mediumspringbud:0xffC9DC87,mediumspringgreen:0xff00FA9A,
		mediumtaupe:0xff674C47,mediumturquoise:0xff48D1CC,mediumtuscanred:0xff79443B,mediumvermilion:0xffD9603B,mediumvioletred:0xffC71585,
		mellowapricot:0xffF8B878,mellowyellow:0xffF8DE7E,melon:0xffFDBCB4,metallicseaweed:0xff0A7E8C,metallicsunburst:0xff9C7C38,mexicanpink:0xffE4007C,
		midnightblue:0xff191970,midnightgreeneaglegreen:0xff004953,mikadoyellow:0xffFFC40C,mindaro:0xffE3F988,mint:0xff3EB489,mintcream:0xffF5FFFA,
		mintgreen:0xff98FF98,mistyrose:0xffFFE4E1,moccasin:0xffFAEBD7,modebeige:0xff967117,moonstoneblue:0xff73A9C2,mordantred19:0xffAE0C00,
		mossgreen:0xff8A9A5B,mountainmeadow:0xff30BA8F,mountbattenpink:0xff997A8D,msugreen:0xff18453B,mughalgreen:0xff306030,mulberry:0xffC54B8C,
		mustard:0xffFFDB58,myrtlegreen:0xff317873,nadeshikopink:0xffF6ADC6,napiergreen:0xff2A8000,naplesyellow:0xffFADA5E,navajowhite:0xffFFDEAD,
		navy:0xff000080,navypurple:0xff9457EB,neoncarrot:0xffFFA343,neonfuchsia:0xffFE4164,neongreen:0xff39FF14,newcar:0xff214FC6,newyorkpink:0xffD7837F,
		nonphotoblue:0xffA4DDED,northtexasgreen:0xff059033,nyanza:0xffE9FFDB,oceanboatblue:0xff0077BE,ochre:0xffCC7722,officegreen:0xff008000,
		oldburgundy:0xff43302E,oldgold:0xffCFB53B,oldheliotrope:0xff563C5C,oldlace:0xffFDF5E6,oldlavender:0xff796878,oldmauve:0xff673147,
		oldmossgreen:0xff867E36,oldrose:0xffC08081,oldsilver:0xff848482,olive:0xff808000,olivedrab3:0xff6B8E23,olivedrab7:0xff3C341F,
		olivine:0xff9AB973,onyx:0xff353839,operamauve:0xffB784A7,orangecolorwheel:0xffFF7F00,orangecrayola:0xffFF7538,orangepantone:0xffFF5800,
		orangeryb:0xffFB9902,orange:0xffFFA500,orangepeel:0xffFF9F00,orangered:0xffFF4500,orchid:0xffDA70D6,orchidpink:0xffF2BDCD,oriolesorange:0xffFB4F14,
		otterbrown:0xff654321,outerspace:0xff414A4C,outrageousorange:0xffFF6E4A,oxfordblue:0xff002147,oucrimsonred:0xff990000,pakistangreen:0xff006600,
		palatinateblue:0xff273BE2,palatinatepurple:0xff682860,paleaqua:0xffBCD4E6,paleblue:0xffAFEEEE,palebrown:0xff987654,palecarmine:0xffAF4035,
		palecerulean:0xff9BC4E2,palechestnut:0xffDDADAF,palecopper:0xffDA8A67,palecornflowerblue:0xffABCDEF,palegold:0xffE6BE8A,palegoldenrod:0xffEEE8AA,
		palegreen:0xff98FB98,palelavender:0xffDCD0FF,palemagenta:0xffF984E5,palepink:0xffFADADD,paleplum:0xffDDA0DD,paleredviolet:0xffDB7093,
		palerobineggblue:0xff96DED1,palesilver:0xffC9C0BB,palespringbud:0xffECEBBD,paletaupe:0xffBC987E,paleturquoise:0xffAFEEEE,paleviolet:0xffCC99FF,
		palevioletred:0xffDB7093,pansypurple:0xff78184A,paoloveronesegreen:0xff009B7D,papayawhip:0xffFFEFD5,paradisepink:0xffE63E62,parisgreen:0xff50C878,
		pastelblue:0xffAEC6CF,pastelbrown:0xff836953,pastelgray:0xffCFCFC4,pastelgreen:0xff77DD77,pastelmagenta:0xffF49AC2,pastelorange:0xffFFB347,
		pastelpink:0xffDEA5A4,pastelpurple:0xffB39EB5,pastelred:0xffFF6961,pastelviolet:0xffCB99C9,pastelyellow:0xffFDFD96,patriarch:0xff800080,
		paynesgrey:0xff536878,peach:0xffFFE5B4,peach:0xffFFCBA4,peachorange:0xffFFCC99,peachpuff:0xffFFDAB9,peachyellow:0xffFADFAD,pear:0xffD1E231,
		pearl:0xffEAE0C8,pearlaqua:0xff88D8C0,pearlypurple:0xffB768A2,peridot:0xffE6E200,periwinkle:0xffCCCCFF,persianblue:0xff1C39BB,persiangreen:0xff00A693,
		persianindigo:0xff32127A,persianorange:0xffD99058,persianpink:0xffF77FBE,persianplum:0xff701C1C,persianred:0xffCC3333,persianrose:0xffFE28A2,
		persimmon:0xffEC5800,peru:0xffCD853F,phlox:0xffDF00FF,phthaloblue:0xff000F89,phthalogreen:0xff123524,pictonblue:0xff45B1E8,pictorialcarmine:0xffC30B4E,
		piggypink:0xffFDDDE6,pinegreen:0xff01796F,pineapple:0xff563C5C,pink:0xffFFC0CB,pinkpantone:0xffD74894,pinklace:0xffFFDDF4,pinklavender:0xffD8B2D1,
		pinkpearl:0xffE7ACCF,pinksherbet:0xffF78FA7,pistachio:0xff93C572,platinum:0xffE5E4E2,plum:0xff8E4585,plum:0xffDDA0DD,pompandpower:0xff86608E,
		popstar:0xffBE4F62,portlandorange:0xffFF5A36,powderblue:0xffB0E0E6,princetonorange:0xffF58025,prune:0xff701C1C,prussianblue:0xff003153,
		psychedelicpurple:0xffDF00FF,puce:0xffCC8899,pucered:0xff722F37,pullmanbrownupsbrown:0xff644117,pumpkin:0xffFF7518,purple:0xff800080,
		purplemunsell:0xff9F00C5,purplex11:0xffA020F0,purpleheart:0xff69359C,purplemountainmajesty:0xff9678B6,purplenavy:0xff4E5180,purplepizzazz:0xffFE4EDA,
		purpletaupe:0xff50404D,purpureus:0xff9A4EAE,quartz:0xff51484F,queenblue:0xff436B95,queenpink:0xffE8CCD7,quinacridonemagenta:0xff8E3A59,
		rackley:0xff5D8AA8,radicalred:0xffFF355E,rajah:0xffFBAB60,raspberry:0xffE30B5D,raspberryglace:0xff915F6D,raspberrypink:0xffE25098,
		raspberryrose:0xffB3446C,rawumber:0xff826644,razzledazzlerose:0xffFF33CC,razzmatazz:0xffE3256B,razzmicberry:0xff8D4E85,red:0xffFF0000,
		redcrayola:0xffEE204D,redmunsell:0xffF2003C,redncs:0xffC40233,redpantone:0xffED2939,redpigment:0xffED1C24,redryb:0xffFE2712,redbrown:0xffA52A2A,
		reddevil:0xff860111,redorange:0xffFF5349,redpurple:0xffE40078,redviolet:0xffC71585,redwood:0xffA45A52,regalia:0xff522D80,resolutionblue:0xff002387,
		rhythm:0xff777696,richblack:0xff004040,richbrilliantlavender:0xffF1A7FE,richcarmine:0xffD70040,richelectricblue:0xff0892D0,richlavender:0xffA76BCF,
		richlilac:0xffB666D2,richmaroon:0xffB03060,riflegreen:0xff444C38,roastcoffee:0xff704241,robineggblue:0xff00CCCC,rocketmetallic:0xff8A7F80,
		romansilver:0xff838996,rose:0xffFF007F,rosebonbon:0xffF9429E,roseebony:0xff674846,rosegold:0xffB76E79,rosemadder:0xffE32636,rosepink:0xffFF66CC,
		rosequartz:0xffAA98A9,rosered:0xffC21E56,rosetaupe:0xff905D5D,rosevale:0xffAB4E52,rosewood:0xff65000B,rossocorsa:0xffD40000,rosybrown:0xffBC8F8F,
		royalazure:0xff0038A8,royalblue1:0xff002366,royalblue2:0xff4169E1,royalfuchsia:0xffCA2C92,royalpurple:0xff7851A9,royalyellow:0xffFADA5E,
		ruber:0xffCE4676,rubinered:0xffD10056,ruby:0xffE0115F,rubyred:0xff9B111E,ruddy:0xffFF0028,ruddybrown:0xffBB6528,ruddypink:0xffE18E96,
		rufous:0xffA81C07,russet:0xff80461B,russiangreen:0xff679267,russianviolet:0xff32174D,rust:0xffB7410E,rustyred:0xffDA2C43,sacramentostategreen:0xff00563F,
		saddlebrown:0xff8B4513,safetyorangeblazeorange:0xffFF6700,safetyyellow:0xffEED202,saffron:0xffF4C430,sage:0xffBCB88A,stpatricksblue:0xff23297A,
		salmon:0xffFA8072,salmonpink:0xffFF91A4,sand:0xffC2B280,sanddune:0xff967117,sandstorm:0xffECD540,sandybrown:0xffF4A460,sandytaupe:0xff967117,
		sangria:0xff92000A,sapgreen:0xff507D2A,sapphire:0xff0F52BA,sapphireblue:0xff0067A5,satinsheengold:0xffCBA135,scarlet:0xffFF2400,
		scarlet:0xffFD0E35,schausspink:0xffFF91AF,schoolbusyellow:0xffFFD800,screamingreen:0xff76FF7A,seablue:0xff006994,seagreen:0xff2E8B57,
		sealbrown:0xff321414,seashell:0xffFFF5EE,selectiveyellow:0xffFFBA00,sepia:0xff704214,shadow:0xff8A795D,shadowblue:0xff778BA5,shampoo:0xffFFCFF1,
		shamrockgreen:0xff009E60,sheengreen:0xff8FD400,shimmeringblush:0xffD98695,shockingpink:0xffFC0FC0,shockingpinkcrayola:0xffFF6FFF,
		sienna:0xff882D17,silver:0xffC0C0C0,silverchalice:0xffACACAC,silverlakeblue:0xff5D89BA,silverpink:0xffC4AEAD,silversand:0xffBFC1C2,
		sinopia:0xffCB410B,skobeloff:0xff007474,skyblue:0xff87CEEB,skymagenta:0xffCF71AF,slateblue:0xff6A5ACD,slategray:0xff708090,smaltdarkpowderblue:0xff003399,
		smitten:0xffC84186,smoke:0xff738276,smokyblack:0xff100C08,smokytopaz:0xff933D41,snow:0xffFFFAFA,soap:0xffCEC8EF,solidpink:0xff893843,
		sonicsilver:0xff757575,spartancrimson:0xff9E1316,spacecadet:0xff1D2951,spanishbistre:0xff807532,spanishblue:0xff0070B8,spanishcarmine:0xffD10047,
		spanishcrimson:0xffE51A4C,spanishgray:0xff989898,spanishgreen:0xff009150,spanishorange:0xffE86100,spanishpink:0xffF7BFBE,spanishred:0xffE60026,
		spanishskyblue:0xff00FFFF,spanishviolet:0xff4C2882,spanishviridian:0xff007F5C,spirodiscoball:0xff0FC0FC,springbud:0xffA7FC00,springgreen:0xff00FF7F,
		starcommandblue:0xff007BB8,steelblue:0xff4682B4,steelpink:0xffCC33CC,stildegrainyellow:0xffFADA5E,stizza:0xff990000,stormcloud:0xff4F666A,
		straw:0xffE4D96F,strawberry:0xffFC5A8D,sunglow:0xffFFCC33,sunray:0xffE3AB57,sunset:0xffFAD6A5,sunsetorange:0xffFD5E53,superpink:0xffCF6BA9,
		tan:0xffD2B48C,tangelo:0xffF94D00,tangerine:0xffF28500,tangerineyellow:0xffFFCC00,tangopink:0xffE4717A,taupe:0xff483C32,taupegray:0xff8B8589,
		teagreen:0xffD0F0C0,tearose:0xffF88379,tearose:0xffF4C2C2,teal:0xff008080,tealblue:0xff367588,tealdeer:0xff99E6B3,tealgreen:0xff00827F,
		telemagenta:0xffCF3476,tenne:0xffCD5700,terracotta:0xffE2725B,thistle:0xffD8BFD8,thulianpink:0xffDE6FA1,ticklemepink:0xffFC89AC,
		tiffanyblue:0xff0ABAB5,tigerseye:0xffE08D3C,timberwolf:0xffDBD7D2,titaniumyellow:0xffEEE600,tomato:0xffFF6347,toolbox:0xff746CC0,
		topaz:0xffFFC87C,tractorred:0xffFD0E35,trolleygrey:0xff808080,tropicalrainforest:0xff00755E,trueblue:0xff0073CF,tuftsblue:0xff417DC1,
		tulip:0xffFF878D,tumbleweed:0xffDEAA88,tumblr:0xff2C4762,turkishrose:0xffB57281,turquoise:0xff40E0D0,turquoiseblue:0xff00FFEF,turquoisegreen:0xffA0D6B4,
		tuscan:0xffFAD6A5,tuscanbrown:0xff6F4E37,tuscanred:0xff7C4848,tuscantan:0xffA67B5B,tuscany:0xffC09999,twilightlavender:0xff8A496B,
		tyrianpurple:0xff66023C,uablue:0xff0033AA,uared:0xffD9004C,ube:0xff8878C3,uclablue:0xff536895,uclagold:0xffFFB300,ufogreen:0xff3CD070,
		ultramarine:0xff120A8F,ultramarineblue:0xff4166F5,ultrapink:0xffFF6FFF,ultrared:0xffFC6C85,umber:0xff635147,unbleachedsilk:0xffFFDDCA,
		unitednationsblue:0xff5B92E5,universityofcaliforniagold:0xffB78727,unmellowyellow:0xffFFFF66,upforestgreen:0xff014421,upmaroon:0xff7B1113,
		upsdellred:0xffAE2029,urobilin:0xffE1AD21,usafablue:0xff004F98,usccardinal:0xff990000,uscgold:0xffFFCC00,universityoftennesseeorange:0xffF77F00,
		utahcrimson:0xffD3003F,vanilla:0xffF3E5AB,vanillaice:0xffF38FA9,vegasgold:0xffC5B358,venetianred:0xffC80815,verdigris:0xff43B3AE,
		vermilion:0xffE34234,vermilion:0xffD9381E,veronica:0xffA020F0,verylightblue:0xff6666FF,verylightmalachitegreen:0xff64E986,verypaleorange:0xffFFDFBF,
		verypaleyellow:0xffFFFFBF,violet:0xff8F00FF,violetcolorwheel:0xff7F00FF,violetryb:0xff8601AF,violet:0xffEE82EE,violetblue:0xff324AB2,
		violetred:0xffF75394,viridian:0xff40826D,viridiangreen:0xff009698,vistablue:0xff7C9ED9,vividauburn:0xff922724,vividburgundy:0xff9F1D35,
		vividcerise:0xffDA1D81,vividgamboge:0xffFF9900,vividmulberry:0xffB80CE3,vividorange:0xffFF5F00,vividorchid:0xffCC00FF,vividraspberry:0xffFF006C,
		vividred:0xffF70D1A,vividredtangelo:0xffDF6124,vividskyblue:0xff00CCFF,vividtangelo:0xffF07427,vividtangerine:0xffFFA089,vividviolet:0xff9F00FF,
		vividyellow:0xffFFE302,warmblack:0xff004242,waterspout:0xffA4F4F9,wenge:0xff645452,wheat:0xffF5DEB3,white:0xffFFFFFF,whitesmoke:0xffF5F5F5,
		wildblueyonder:0xffA2ADD0,wildorchid:0xffD470A2,wildstrawberry:0xffFF43A4,wildwatermelon:0xffFC6C85,willpowerorange:0xffFD5800,
		windsortan:0xffA75502,wine:0xff722F37,winedregs:0xff673147,wisteria:0xffC9A0DC,woodbrown:0xffC19A6B,xanadu:0xff738678,yaleblue:0xff0F4D92,
		yankeesblue:0xff1C2841,yellow:0xffFFFF00,yellowcrayola:0xffFCE883,yellowmunsell:0xffEFCC00,yellowncs:0xffFFD300,yellowpantone:0xffFEDF00,
		yellowprocess:0xffFFEF00,yellowryb:0xffFEFE33,yellowgreen:0xff9ACD32,yelloworange:0xffFFAE42,yellowrose:0xffFFF000,zaffre:0xff0014A8,
		zinnwalditebrown:0xff2C1608,zomp:0xff39A78E, transparent:0x0
	}

	exports.parseVec2 = function(str, o){
		var a = o || vec4()
		var fcol = parseFloat(str) 
		if (fcol == str)  {
			return vec2(fcol)
		}

		var vec2m = str.match(/^vec2\s*\(\s*(\d+)\s*,\s*(\d+)\s*\)$/i)
		if( vec2m ) {
			a[0] = vec2m[1]
			a[1] = vec2m[2]
			return a
		}
	
		var vec2m = str.match(/^\s*(\d+)\s*,\s*(\d+)\s*$/i)
		if( vec2m ) {
			a[0] = vec2m[1]
			a[1] = vec2m[2]
			return a
		}

	}

	exports.parseVec3 = function(str, o){
		var a = o || vec4()
		var fcol = parseFloat(str)  
		if (fcol == str)  {
			a[0] = fcol
			a[1] = fcol
			a[2] = fcol
			return a
		}

		var vec3m = str.match(/^vec4\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/i)
		if( vec3m ) {
			a[0] = vec3m[1]
			a[1] = vec3m[2]
			a[2] = vec3m[3]
			return a;
		}
	
		var vec3m = str.match(/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*$/i)
		if( vec3m ) {
			a[0] = vec3m[1]
			a[1] = vec3m[2]
			a[2] = vec3m[3]
			return a;
		}

	}

	// color parser
	exports.parseVec4 = function(col, o) {

		if(col && col.struct) return col // pass through	

		col = col.trim().toLowerCase();

		var c = color_wikipedia[col] // color LUT
		var a = o || vec4()
		if (c !== undefined){
			a[0] = ((c >> 16)&0xff) /255
			a[1] = ((c >> 8)&0xff) /255
			a[2] = (c&0xff) /255
			
			a[3] = ((c >> 24)&0xff) /255 // alpha
			
			return a
		}

		var fcol = parseFloat(col)  
		if (fcol == col)  {
			a[0] = fcol
			a[1] = fcol
			a[2] = fcol
			a[3] = fcol
			return a
		}
						
		var hex3 = col.match(/^#([0-9a-f]{3})$/i);
		if (hex3) {
			hex3 = hex3[1];
			a[0] = parseInt(hex3.charAt(0),16)*0x11/255.0;
			a[1] = parseInt(hex3.charAt(1),16)*0x11/255.0;
			a[2] = parseInt(hex3.charAt(2),16)*0x11/255.0;
			a[3] = 1.0;
			return a;
		}
		
		var hex6 = col.match(/^#([0-9a-f]{6})$/i);
		if (hex6) {
			hex6 = hex6[1];
			a[0] = parseInt(hex6.substr(0,2),16)/255.0;
			a[1] = parseInt(hex6.substr(2,2),16)/255.0;
			a[2] = parseInt(hex6.substr(4,2),16)/255.0;
			a[3] = 1.0;
		//	console.log("hex6" ,a);
			return a;
		}

		var rgba = col.match(/^rgba\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+.*\d*)\s*\)$/i) || col.match(/^rgba\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/i);
		if( rgba ) {
			a[0] = rgba[1]/255.0;
			a[1] = rgba[2]/255.0;
			a[2] = rgba[3]/255.0;
			a[3] = rgba[4]===undefined?1:rgba[4]/255.0;
	//			console.log("rgba" ,a);
		
			return a;
		}
		var rgb = col.match(/^rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/i);
		if( rgb ) {
			a[0] = rgb[1]/255.0;
			a[1] = rgb[2]/255.0;
			a[2] = rgb[3]/255.0;
			a[3] = 1.0;
//			console.log("rgb" ,a);

			return a;
		}

		var vec4m = col.match(/^vec4\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/i);
		if( vec4m ) {
			a[0] = vec4m[1];
			a[1] = vec4m[2];
			a[2] = vec4m[3];
			a[3] = vec4m[4];
			return a;
		}
	
		var vec4m = col.match(/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*$/i);
		if( vec4m ) {
			a[0] = vec4m[1];
			a[1] = vec4m[2];
			a[2] = vec4m[3];
			a[3] = vec4m[4];
			return a;
		}

		// lets parse the color
		var len = col.length
		var i = 0
		if (col.charAt(0) == '#') i++;
		c = 0
		while(i<len) {
			var ch = col.charCodeAt(i++)
			if(ch >= 48 && ch <= 57) { // hex color
				c = c << 4
				c += ch - 48
			}
			else if(ch >= 97 && ch <= 102) {
				c = c << 4
				c += ch - 87
			}
			else if(ch >= 65 && ch <= 70) {
				c = c << 4
				c += ch - 55
			}
			else { // try to find the nearest color
				col = col.toLowerCase()
				c = color_wikipedia[col]
				if(c === undefined) for(var k in color_wikipedia){
					if(k.indexOf(col) != -1){
						c = color_wikipedia[k]
						// cache it
						color_wikipedia[col] = c
						break
					}
				}
				len = 0
			}
		}
		if(len == 3){			
			a[0] = ((c&0xf00)>>8|(c&0xf00)>>4) /255
			a[1] = ((c&0xf0)|(c&0xf0)>>4) /255
			a[2] = ((c&0xf)|(c&0xf)<<4) /255 
			return a
		}
		
		a[0] = ((c >> 16)&0xff) /255
		a[1] = ((c >> 8)&0xff) /255
		a[2] = (c&0xff) /255		
		a[3] = 1.0;
		//a[3] = ((c >> 24)&0xff) /255 // alpha
		
		return a
	}
})