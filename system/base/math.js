/* Copyright 2015-2016 Teeming Society. Licensed under the Apache License, Version 2.0 (the "License"); DreemGL is a collaboration between Teeming Society & Samsung Electronics, sponsored by Samsung and others.
 You may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
 either express or implied. See the License for the specific language governing permissions and limitations under the License.*/

define(function(){

	// provide all the apis on our math types
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

	vec2.parse = function(str, o){
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

	vec3.parse = function(str, o){
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
	vec4.parse = function(col, o, noerror) {

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

		var vec4m = col.match(/^\s*(\d+)\s+(\d+)\s+(\d+)\s+(\d+)\s*$/i);
		if( vec4m ) {
			a[0] = vec4m[1];
			a[1] = vec4m[2];
			a[2] = vec4m[3];
			a[3] = vec4m[4];
			return a;
		}
		// lets parse the color
		if(!noerror) console.error("Cannot parse color "+col)
		a[0] = -1
		a[1] = 1
		a[2] = 0.85
		a[3] = 1
		return a
		/*
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
			console.log("here", col, a)
			return a
		}

		a[0] = ((c >> 16)&0xff) /255
		a[1] = ((c >> 8)&0xff) /255
		a[2] = (c&0xff) /255
		a[3] = 1.0;
		console.log("ho", col, a)
		//return [1,1,1,1]
		//console.log(c)
		return undefined


		//a[3] = ((c >> 24)&0xff) /255 // alpha

		return a*/
	}

	function matApi(exports){
	}

	// shared vector api
	function vecApi(exports){
		function vecFn(fn){
			return function(a, o){
				if(!o) o = exports()
				for(var i = 0; i < a.length; i++) o[i] = fn(a[i])
				return o
			}
		}

		function vecFn2(fn){
			return function(a, b, o){
				if(!o) o = exports()
				for(var i = 0; i < a.length; i++) o[i] = fn(a[i], b[i])
				return o
			}
		}

		exports.sin = vecFn(Math.sin)
		exports.cos = vecFn(Math.cos)
		exports.tan = vecFn(Math.tan)
		exports.asin = vecFn(Math.asin)
		exports.acos = vecFn(Math.acos)
		exports.atan = vecFn(Math.atan)
		exports.pow = vecFn(Math.pow)
		exports.exp = vecFn(Math.exp)
		exports.log = vecFn(Math.log)
		exports.exp2 = vecFn(function(v){return Math.pow(2, v)})
		exports.log2 = vecFn(Math.log2)
		exports.sqrt = vecFn(Math.sqrt)
		exports.inversesqrt = vecFn(function(v){ return 1/Math.sqrt(v)})
		exports.abs = vecFn(Math.abs)
		exports.floor = vecFn(Math.floor)
		exports.ceil = vecFn(Math.ceil)
		exports.min = vecFn(Math.min)
		exports.max = vecFn(Math.max)
		exports.mod = vecFn2(function(a,b){
			return a%b
		})

		exports.identity = function(o){
			if(!o) o = exports()
			for(var i = 0;i<o.length;i++) o[i] = 0
			return o
		}

		exports.distance = function(a, b){
			var d = 0
			for(var i = 0; i < a.length; i++){
				d+= Math.pow(a[i] - b[i], 2)
			}
			return Math.sqrt(d)
		}

		exports.len = function(a){
			var d = 0
			for(var i = 0; i < a.length; i++) d += Math.pow(a[i], 2)
			return Math.sqrt(d)
		}

		exports.negate = function(a, o){
			if(!o) o = exports()
			for(var i = 0; i < a.length; i++) o[i] = -a[i]
			return o
		}

		exports.inverse = function(a, o){
			if(!o) o = exports()
			for(var i = 0; i < a.length; i++) o[i] = 1 / a[i]
			return o
		}

		exports.mix = function(a, b, f, o){
			if(!o) o = exports()
			for(var i = 0; i < a.length; i++) o[i] = a[i] + f * (b[i] - a[i])
			return o
		}

		exports.mix2 = function(a, b, f, o){
			if(!o) o = exports()
			for(var i = 0; i < a.length; i++) o[i] = a[i] + f[i] * (b[i] - a[i])
			return o
		}

		exports.greater = function(a, b){
			if(a[i] < b[i]) return false
			return true
		}

		exports.normalize = function(a, o){
			if(!o) o = exports()
			var d = 0
			for(var i = 0; i < a.length; i++) d += Math.pow(a[i], 2)
			d = Math.sqrt(d)
			for(var i = 0; i < a.length; i++) o[i] = a[i] / d
			return o
		}
	}

	vecApi(vec2)

	vec2.fromString = function(color){
		var o = this
		if(this === vec2) o = vec2()
		return vec2.parse(color, o)
	}

	vec2.random = function( scale, o){
		if(scale === undefined) scale = 1
		if(!o) o = vec2()
		var r = exports.PI2 * Math.random()
		o[0] = cos(r) * scale
		o[1] = sin(r) * scale
		return o
	}

	vec2.mul =
	vec2.vec2_mul_vec2 = function(a, b, o){
		if(!o) o = vec2()
		o[0] = a[0] * b[0]
		o[1] = a[1] * b[1]
		return o
	}

	vec2.add =
	vec2.vec2_add_vec2 = function(a, b, o){
		if(!o) o = vec2()
		o[0] = a[0] + b[0]
		o[1] = a[1] + b[1]
		return o;
	}

	vec2.sub =
	vec2.vec2_sub_vec2 = function(a, b, o){
		if(!o) o = vec2()
		o[0] = a[0] - b[0]
		o[1] = a[1] - b[1]
		return o
	}

	vec2.div =
	vec2.vec2_div_vec2 = function(a, b, o){
		if(!o) o = vec2()
		o[0] = a[0] / b[0]
		o[1] = a[1] / b[1]
		return o
	}

	vec2.mul_mat2 =
	vec2.vec2_mul_mat2 = function(v, m, o){
		if(!o) o = vec2()
		o[0] = m[0] * v[0] + m[2] * v[1]
		o[1] = m[1] * v[0] + m[3] * v[1]
		return o
	}

	vec2.mul_mat3 =
	vec2.vec2_mul_mat3 = function(v, m, o){
		if(!o) o = vec2()
		o[0] = m[0] * v[0] + m[2] * v[1] + m[4]
		o[1] = m[1] * v[0] + m[3] * v[1] + m[5]
		return o
	}

	vec2.mul_mat4 =
	vec2.vec2_mul_mat4 = function(v, m, o){
		if(!o) o = vec2()
		o[0] = m[0] * v[0] + m[4] * v[1] + m[12]
		o[1] = m[1] * v[0] + m[5] * v[1] + m[13]
		return o
	}
	vec2.mul_mat4_t =
	vec2.vec2_mul_mat4_t = function(v, m, o){
		if(!o) o = vec2()
		o[0] = m[0] * v[0] + m[1] * v[1] + m[3]
		o[1] = m[4] * v[0] + m[5] * v[1] + m[7]
		return o
	}

	vec2.mul_float32 =
	vec2.vec2_mul_float32 = function(v, f, o){
		if(!o) o = vec2()
		o[0] = v[0] * f
		o[1] = v[1] * f
		return o
	}

	vec2.lessThan = function(a, b, o){
		if(!o) o = exports.bvec2()
		o[0] = a[0] < b[0]
		o[1] = a[1] < b[1]
		return o
	}

	vec2.lessThanEqual = function(a, b, o){
		if(!o) o = exports.bvec2()
		o[0] = a[0] <= b[0]
		o[1] = a[1] <= b[1]
		return o
	}

	vec2.greaterThan = function(a, b, o){
		if(!o) o = exports.bvec2()
		o[0] = a[0] > b[0]
		o[1] = a[1] > b[1]
		return o
	}

	vec2.greaterThanEqual = function(a, b, o){
		if(!o) o = exports.bvec2()
		o[0] = a[0] >= b[0]
		o[1] = a[1] >= b[1]
		return o
	}

	vec2.equal = function(a, b, o){
		if(!o) o = exports.bvec2()
		o[0] = a[0] == b[0]
		o[1] = a[1] == b[1]
		return o
	}

	vec2.equals = function(a, b){
		return a[0] === b[0] && a[1] === b[1]
	}

	vec2.notEqual = function(a, b, o){
		if(!o) o = exports.bvec2()
		o[0] = a[0] != b[0]
		o[1] = a[1] != b[1]
		return o
	}

	vec2.ortho = function(a, o){
		if(!o) o = vec2()
		var x = -a[1];
		var y = a[0];
		o[0] = x;
		o[1] = y;
		return o;
	}

	vec2.rotate = function(a, ang, o){
		if(!o) o = vec2()

		var sa = Math.sin(ang);
		var ca = Math.cos(ang);

		o = vec2(ca*a[0] - sa * a[1],sa*a[0] + ca * a[1])


		return o;

	}

	vecApi(vec3)

	vec3.intersectplane = function(origin, direction, normal, dist) {
		var denom = vec3.dot(direction, normal)
		if (denom !== 0) {
			var t = -(vec3.dot(origin, normal) + dist) / denom
			if (t < 0) {
				console.log("t = 0?")
				return null
			}
			var diradd = vec3.vec3_mul_float(direction, t);
			var res = vec3.add(origin, diradd);
//			console.log(origin, direction, t,diradd, res);
			return res;
		}
		else {
			if (vec3.dot(normal, origin) + dist === 0) {
				return origin
			}
			else {
				return null
			}
		}
	}

	vec2.dot = function(a,b){
		return a[0] * b[0] + a[1] * b[1] ;
	}
	vec3.dot = function(a,b){
	//	console.log(a,b);
		return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
	}

	vec3.fromString = function(color){
		var o = this
		if(this === vec3) o = vec3()
		return vec3.parse(color, o)
	}

	vec3.random = function(scale, o){
		if(scale === undefined) scale = 1
		if(!o) o = vec3()
		var r = 2*exports.PI * Math.random()
		var zr = (Math.random() * 2.0) - 1.0
		o[0] = cos(r) * zr
		o[1] = sin(r) * zr
		o[2] = sqrt(1.0 - zr*zr) * scale
		return o
	}

	vec3.mul =
	vec3.vec3_mul_vec3 = function(a, b, o){
		if(!o) o = vec3()
		o[0] = a[0] * b[0]
		o[1] = a[1] * b[1]
		o[2] = a[2] * b[2]
		return o
	}

	vec3.mulfloat =
	vec3.vec3_mul_float = function(a, b, o){
		if(!o) o = vec3()
		o[0] = a[0] * b
		o[1] = a[1] * b
		o[2] = a[2] * b
		return o
	}

	vec3.add =
	vec3.vec3_add_vec3 = function(a, b, o){
		if(!o) o = vec3()
		o[0] = a[0] + b[0]
		o[1] = a[1] + b[1]
		o[2] = a[2] + b[2]
		return o
	}

	vec3.sub =
	vec3.vec3_sub_vec3 = function(a, b, o){
		if(!o) o = vec3()
		o[0] = a[0] - b[0]
		o[1] = a[1] - b[1]
		o[2] = a[2] - b[2]
		return o
	}

	vec3.div =
	vec3.vec3_div_vec3 = function(a, b, o){
		if(!o) o = vec3()
		o[0] = a[0] / b[0]
		o[1] = a[1] / b[1]
		o[2] = a[2] / b[2]
		return o
	}

	vec3.mul_mat3 =
	vec3.vec3_mul_mat3 = function(v, m, o){
		if(!o) o = vec3()
		o[0] = v[0] * m[0] + v[1] * m[1] + v[2] * m[2]
		o[1] = v[0] * m[3] + v[1] * m[4] + v[2] * m[5]
		o[2] = v[0] * m[6] + v[1] * m[7] + v[2] * m[8]
		return o
	}

	vec3.mul_mat4 =
	vec3.vec3_mul_mat4 = function(v, m, o){
		if(!o) o = vec3()
		var vx = v[0], vy = v[1], vz = v[2], vw =
			m[12] * vx + m[13] * vy + m[14] * vz + m[15]
		vw = vw || 1.0
		o[0] = (m[0] * vx + m[1] * vy + m[2] * vz + m[3]) / vw
		o[1] = (m[4] * vx + m[5] * vy + m[6] * vz + m[7]) / vw
		o[2] = (m[8] * vx + m[9] * vy + m[10] * vz + m[11]) / vw
		return o
	}

	vec2.mul_mat4 =
	vec2.vec2_mul_mat4 = function(v, m, o){
		if(!o) o = vec2()
		o[0] = m[0] * v[0] + m[1] * v[1] + m[3]
		o[1] = m[4] * v[0] + m[5] * v[1] + m[7]
		return o
	}

	vec3.mul_mat4_minor =
	vec3.vec3_mul_mat4_minor = function(v, m, o){
		if(!o) o = vec3()
		var vx = v[0], vy = v[1], vz = v[2]
		o[0] = vx * m[0] + vy * m[1] + vz * m[2]
		o[1] = vx * m[4] + vy * m[5] + vz * m[6]
		o[2] = vx * m[8] + vy * m[9] + vz * m[10]
		return o
	}

	vec3.cross =
	vec3.vec3_cross_vec3 = function(a, b, o){
		if(!o) o = vec3()
		var ax = a[0], ay = a[1], az = a[2]
		var bx = b[0], by = b[1], bz = b[2]
		o[0] = ay * bz - az * by
		o[1] = az * bx - ax * bz
		o[2] = ax * by - ay * bx
		return o
	}

	vec3.lessThan = function(a, b, o){
		if(!o) o = exports.bvec3()
		o[0] = a[0] < b[0]
		o[1] = a[1] < b[1]
		o[2] = a[2] < b[2]
		return o
	}

	vec3.lessThanEqual = function(a, b, o){
		if(!o) o = exports.bvec3()
		o[0] = a[0] <= b[0]
		o[1] = a[1] <= b[1]
		o[2] = a[2] <= b[2]
		return o
	}

	vec3.greaterThan = function(a, b, o){
		if(!o) o = exports.bvec3()
		o[0] = a[0] > b[0]
		o[1] = a[1] > b[1]
		o[2] = a[2] > b[2]
		return o
	}

	vec3.greaterThanEqual = function(a, b, o){
		if(!o) o = exports.bvec3()
		o[0] = a[0] >= b[0]
		o[1] = a[1] >= b[1]
		o[2] = a[2] >= b[2]
		return o
	}

	vec3.equal = function(a, b, o){
		if(!o) o = exports.bvec3()
		o[0] = a[0] == b[0]
		o[1] = a[1] == b[1]
		o[2] = a[2] == b[2]
		return o
	}

	vec3.equals = function(a, b){
		return a[0] === b[0] && a[1] === b[1] && a[2] === b[2]
	}

	vec3.notEqual = function(a, b, o){
		if(!o) o = exports.bvec3()
		o[0] = a[0] != b[0]
		o[1] = a[1] != b[1]
		o[2] = a[2] != b[2]
		return o
	}

	vecApi(vec4)

	vec4.dot = function(a,b){
		return a.x * b.x + a.y * b.y + a.z * b.z + a.w * b.w;
	}
	vec4.desaturate = function(incolor, amt){
		if (!amt) amt = 1.0
		var hsv = vec4.toHSV(incolor);
		return vec4.fromHSV(hsv[0], hsv[1] * (1.0-amt), hsv[2]);
	}
	vec4.contrastcolor = function(incolor){
		var hsl = vec4.toHSV(incolor);
		var l = 0;
		if (hsl[2] > 0.5) {
			if (hsl[1] > 0.7) {
				l = 1;
			}
			else {
				l = 0;
			}
		}
		else {
			l = 1;
		}
		return	vec4.fromHSV(0,0,l,1);
	}

	// converts standard vec4 color in to HSL space (not to be confused with HSV space!)
	vec4.toHSL = function(inp){
		var max = Math.max(inp[0], inp[1], inp[2]), min = Math.min(inp[0], inp[1], inp[2]);
		var h, s, l = (max + min) / 2;
		var r = inp[0];
		var g = inp[1];
		var b = inp[2];
		if(max == min){
			h = s = 0; // achromatic
		}else{
			var d = max - min;
			s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
			if (max == inp[0]){
					h = (g - b) / d + (g < b ? 6 : 0);
			}
			else{
				if (max == inp[1]){

				h = (b - r) / d + 2;
				}
				else{

				 h = (r - g) / d + 4;
				}
			}
			h /= 6;
		}
		return [h, s, l, inp[3]];;
	}

	// calculate an RGBA color from an HSLA color
	// h/s/l/a = [0..1] range.
	vec4.fromHSL = function(h,s,l,a,o){
		if(!o) o = vec4()

		var r, g, b;

		if(s == 0){
			r = g = b = l; // achromatic
		}else{
			var
			hue2rgb = function hue2rgb(p, q, t){
				if(t < 0) {
					t += 1;
				}
				else {
					if(t > 1) t -= 1;
				}

				if(t < 1/6) return p + (q - p) * 6 * t;
				if(t < 1/2) return q;
				if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
				return p;
			}


			var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
			var p = 2 * l - q;
			r = hue2rgb(p, q, h + 1/3);
			g = hue2rgb(p, q, h);
			b = hue2rgb(p, q, h - 1/3);
		}
		o[0] = r;
		o[1] = g;
		o[2] = b;
		o[3] = a !== undefined?a: 1.0

		return o;
	}

	// converts standard vec4 color in to HSL space (not to be confused with HSV space!)
	vec4.toHSV = function(inp){


    var r = inp[0];
    var g = inp[1];
    var b = inp[2];

    var max = Math.max(r, Math.max(g, b)), min = Math.min(r, Math.min(g, b));
    var h, s, v = max;

    var d = max - min;
    s = max === 0 ? 0 : d / max;

    if(max == min) {
        h = 0; // achromatic
    }
    else {
        switch(max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }
//    return { h: h, s: s, v: v };




		return [h, s, v, inp[3]];;
	}

	// calculate an RGBA color from an HSVA color
	// h/s/l/a = [0..1] range.
	vec4.fromHSV = function(h,s,v,a,o){
		if(!o) o = vec4()

		h *= 360;
		if (h < 0) h+=360;

		var r = 0.0;
		var g = 0.0;
		var b = 0.0;

		if(s == 0.0){
			r = g = b = v; // achromatic
		}else{
			var t1 = v;
			var t2 = (1. - s) * v;
			var t3 = (t1 - t2) * (h %60 ) / 60.;
			if (h == 360.) h = 0.;
			if (h < 60.) { r = t1; b = t2; g = t2 + t3 }
			else if (h < 120.) { g = t1; b = t2; r = t1 - t3 }
			else if (h < 180.) { g = t1; r = t2; b = t2 + t3 }
			else if (h < 240.) { b = t1; r = t2; g = t1 - t3 }
			else if (h < 300.) { b = t1; g = t2; r = t2 + t3 }
			else if (h < 360.) { r = t1; g = t2; b = t1 - t3 }
			else { r = 0.; g = 0.; b = 0. }
		}
		o[0] = r;
		o[1] = g;
		o[2] = b;
		o[3] = a !== undefined? a: 1.0
		return o;

	}


	vec4.equals = function(a,b)
	{
		if (a[0] != b[0]) return false;
		if (a[1] != b[1]) return false;
		if (a[2] != b[2]) return false;
		if (a[3] != b[3]) return false;
		return true;
	}
	vec4.fromString = function(color, alpha){
		var o = this
		if(this === vec4) o = vec4()
		return vec4.parse(color, o)
	}

	// TODO wrong
	vec4.random = function(scale, o){
		if(scale === undefined) scale = 1
		if(!o) o = vec3()
		o[0] = Math.random()
		o[1] = Math.random()
		o[2] = Math.random()
		o[3] = Math.random()
		vec4.normalize(o, o)
		return o
	}

	vec4.mul =
	vec4.vec4_mul_vec4 = function(a, b, o){
		if(!o) o = vec4()
		o[0] = a[0] * b[0]
		o[1] = a[1] * b[1]
		o[2] = a[2] * b[2]
		o[3] = a[3] * b[3]
		return o
	}

	vec4.mul_float32 =
	vec4.vec4_mul_float32 = function(a, b, o){
		if(!o) o = vec4()
		o[0] = a[0] * b
		o[1] = a[1] * b
		o[2] = a[2] * b
		o[3] = a[3] * b
		return o
	}

	vec4.vec4_mul_float32_rgb = function(a, b, o){
		if(!o) o = vec4()
		o[0] = a[0] * b
		o[1] = a[1] * b
		o[2] = a[2] * b
		o[3] = a[3]
		return o
	}

	vec4.add =
	vec4.vec4_add_vec4 = function(a, b, o){
		if(!o) o = vec4()
		o[0] = a[0] + b[0]
		o[1] = a[1] + b[1]
		o[2] = a[2] + b[2]
		o[3] = a[3] + b[3]
		return o
	}

	vec4.sub =
	vec4.vec4_sub_vec4 = function(a, b, o){
		if(!o) o = vec4()
		o[0] = a[0] - b[0]
		o[1] = a[1] - b[1]
		o[2] = a[2] - b[2]
		o[3] = a[3] - b[3]
		return o
	}

	vec4.div =
	vec4.vec4_div_vec4 = function(a, b, o){
		if(!o) o = vec4()
		o[0] = a[0] / b[0]
		o[1] = a[1] / b[1]
		o[2] = a[2] / b[2]
		o[3] = a[3] / b[3]
		return o
	}

	vec4.mul_mat4 =
	vec4.vec4_mul_mat4 = function(v, m, o){
		if(!o) o = vec4()
		var vx = v[0], vy = v[1], vz = v[2], vw = v[3]
		o[0] = m[0] * vx + m[1] * vy + m[2] * vz + m[3] * vw
		o[1] = m[4] * vx + m[5] * vy + m[6] * vz + m[7] * vw
		o[2] = m[8] * vx + m[9] * vy + m[10] * vz + m[11] * vw
		o[3] = m[12] * vx + m[13] * vy + m[14] * vz + m[15] * vw
		return o
	}


	vec4.mul_quat =
	vec4.vec4_mul_quat = function(v, q, o){
		if(!o) o = vec4()
		var vx = v[0], vy = v[1], vz = v[2],
			qx = q[0], qy = q[1], qz = q[2], qw = q[3],
			// calculate quat * vec
			ix = qw * vx + qy * vz - qz * vy,
			iy = qw * vy + qz * vx - qx * vz,
			iz = qw * vz + qx * vy - qy * vx,
			iw = -qx * vx - qy * vy - qz * vz
		// calculate result * inverse quat
		o[0] = ix * qw + iw * -qx + iy * -qz - iz * -qy
		o[1] = iy * qw + iw * -qy + iz * -qx - ix * -qz
		o[2] = iz * qw + iw * -qz + ix * -qy - iy * -qx
		o[3] = v[3]
		return o
	}

	vec4.lessThan = function(a, b, o){
		if(!o) o = exports.bvec4()
		o[0] = a[0] < b[0]
		o[1] = a[1] < b[1]
		o[2] = a[2] < b[2]
		o[3] = a[3] < b[3]
		return o
	}

	vec4.lessThanEqual = function(a, b, o){
		if(!o) o = exports.bvec4()
		o[0] = a[0] <= b[0]
		o[1] = a[1] <= b[1]
		o[2] = a[2] <= b[2]
		o[3] = a[3] <= b[3]
		return o
	}

	vec4.greaterThan = function(a, b, o){
		if(!o) o = exports.bvec4()
		o[0] = a[0] > b[0]
		o[1] = a[1] > b[1]
		o[2] = a[2] > b[2]
		o[3] = a[3] > b[3]
		return o
	}

	vec4.greaterThanEqual = function(a, b, o){
		if(!o) o = exports.bvec4()
		o[0] = a[0] >= b[0]
		o[1] = a[1] >= b[1]
		o[2] = a[2] >= b[2]
		o[3] = a[3] >= b[3]
		return o
	}

	vec4.equal = function(a, b, o){
		if(!o) o = exports.bvec4()
		o[0] = a[0] == b[0]
		o[1] = a[1] == b[1]
		o[2] = a[2] == b[2]
		o[3] = a[3] == b[3]
		return o
	}

	vec4.notEqual = function(a, b, o){
		if(!o) o = exports.bvec4()
		o[0] = a[0] != b[0]
		o[1] = a[1] != b[1]
		o[2] = a[2] != b[2]
		o[3] = a[3] != b[3]
		return o
	}

	vecApi(quat)

	quat.identity = function(o){
		if(!o) o = quat()
		o[0] = o[1] = o[2] = 0, o[3] = 1
		return o
	}

	quat.mul =
	quat.quat_mul_quat = function(a, b, o){
		if(!o) o = quat()
		var ax = a[0], ay = a[1], az = a[2], aw = a[3],
			bx = b[0], by = b[1], bz = b[2], bw = b[3]
		o[0] = ax * bw + aw * bx + ay * bz - az * by
		o[1] = ay * bw + aw * by + az * bx - ax * bz
		o[2] = az * bw + aw * bz + ax * by - ay * bx
		o[3] = aw * bw - ax * bx - ay * by - az * bz
		return o
	}

	quat.rotateX = function(q, angle, o){
		if(!o) o = quat()
		angle *= 0.5
		var ax = q[0], ay = q[1], az = q[2], aw = q[3],
		    bx = sin(angle), bw = cos(angle)

		o[0] = ax * bw + aw * bx
		o[1] = ay * bw + az * bx
		o[2] = az * bw - ay * bx
		o[3] = aw * bw - ax * bx
		return o
	}

	// rotate quaternion Q with angle A around y axis
	quat.rotateY = function(q, angle, o){
		if(!o) o = quat()
		angle *= 0.5
		var ax = q[0], ay = q[1], az = q[2], aw = q[3],
			by = sin(angle), bw = cos(angle)

		o[0] = ax * bw - az * by
		o[1] = ay * bw + aw * by
		o[2] = az * bw + ax * by
		o[3] = aw * bw - ay * by
		return o
	}

	// rotate quaternion Q with angle A around z axis
	quat.rotateZ = function(q, angle, o){
		if(!o) o = quat()
		angle *= 0.5
		var ax = q.x, ay = q.y, az = q.z, aw = q.w,
			bz = sin(angle), bw = cos(angle)

		o[0] = ax * bw + ay * bz
		o[1] = ay * bw - ax * bz
		o[2] = az * bw + aw * bz
		o[3] = aw * bw - az * bz
		return o
	}

	// Calculate w from xyz
	quat.calculateW = function(q, o){
		if(!o) o = quat()
		o[0] = q[0]
		o[1] = q[1]
		o[2] = q[2]
		o[3] = -sqrt(abs(1.0 - x * x - y * y - z * z))
		return o
	}

	// spherelical linear interpolation between quat A and B with f (0-1)
	quat.slerp = function(a, b, f, o){
		if(!o) o = quat()
		var ax = a[0], ay = a[1], az = a[2], aw = a[3],
			bx = b[0], by = b[1], bz = b[2], bw = b[3]

		var omega, cosom, sinom, scale0, scale1

		// calc cosine
		cosom = ax * bx + ay * by + az * bz + aw * bw
		// adjust signs (if necessary)
		if (cosom < 0.0) {
			cosom = -cosom
			bx = - bx, by = - by, bz = - bz, bw = - bw
		}
		// calculate coefficients
		if ( (1.0 - cosom) > 0.000001 ) {
			// standard case (slerp)
			omega  = acos(cosom)
			sinom  = sin(omega)
			scale0 = sin((1.0 - f) * omega) / sinom
			scale1 = sin(f * omega) / sinom
		}
		else { // linear interpolate if very close
			scale0 = 1.0 - f
			scale1 = f
		}
		// calculate final values
		o[0] = scale0 * ax + scale1 * bx
		o[1] = scale0 * ay + scale1 * by
		o[2] = scale0 * az + scale1 * bz
		o[3] = scale0 * aw + scale1 * bw
		return o
	}

	// invert Q
	quat.invert = function(q, o){
		if(!o) o = quat()
		var a0 = q[0], a1 = q[1], a2 = q[2], a3 = q[3],
			d = a0*a0 + a1*a1 + a2*a2 + a3*a3,
			i = d ? 1.0/d : 0
		o[0] = -a0*i, o[1] = -a1*i, o[2] = -a2*i, o[3] = a3*i
	}

	// Calculates the conjugate of quat Q
	// If the quaternion is normalized, this function is faster than quat.inverse and produces the same result.
	quat.conjugate = function(q, o){
		if(!o) o = quat()
		o[0] = -q[0], o[1] = -q[1], o[2] = -q[2], o[3] = q[3]
		return o
	}

	quat.fromMat3 = function(m, o){
		if(!o) o = quat()
		// Algorithm in Ken Shoemake's article in 1987 SIGGRAPH course notes
		// article "Quaternion Calculus and Fast Animation".
		var t = m[0] + m[4] + m[8], r
		if ( t > 0.0 ) {
			// |w| > 1/2, may as well choose w > 1/2
			r = sqrt(T + 1.0)  // 2w
			w = 0.5 * r
			r = 0.5/r  // 1/(4w)
			x = (m[5]-m[7])*r, y = (m[6]-m[2])*r, z = (m[1]-m[3])*r
		}
		else {
			// |w| <= 1/2
			var i = 0
			if ( m[4] > m[0] ) i = 1
			if ( m[8] > m[i*3+i] ) i = 2
			var j = (i+1)%3
			var k = (i+2)%3

			r = sqrt(m[i*3+i]-m[j*3+j]-m[k*3+k] + 1.0)
			o[i] = 0.5 * r
			r = 0.5 / r
			w = (m[j*3+k] - m[k*3+j]) * r
			o[j] = (m[j*3+i] + m[i*3+j]) * r
			o[k] = (m[k*3+i] + m[i*3+k]) * r
		}
		return o
	}

	matApi(mat2)

	mat2.identity = function(o){
		if(!o) o = mat2()
		o[0] = 1, o[1] = 0
		o[2] = 0, o[2] = 1
	}

	mat2.mul =
	mat2.mat2_mul_mat2 = function(a, b, o){
		if(!o) o = mat2()
		var a0 = a[0], a1 = a[1], a2 = a[2], a3 = a[3]
		var b0 = b[0], b1 = b[1], b2 = b[2], b3 = b[3]
		o[0] = a0 * b0 + a2 * b1
		o[1] = a1 * b0 + a3 * b1
		o[2] = a0 * b2 + a2 * b3
		o[3] = a1 * b2 + a3 * b3
		return o
	}

	mat2.rotate = function(a, angle, o){
		if(!o) o = mat2()
		var a00 = a[0], a01 = a[1],
		    a10 = a[2], a11 = a[3],
		    s = sin(angle), c = cos(angle)
		o[0] = a00 * c + a10 * s
		o[1] = a01 * c + a11 * s
		o[2] = a00 * -s + a10 * c
		o[3] = a01 * -s + a11 * c
		return o
	}

	mat2.scale = function(a, scale, o){
		if(!o) o = mat2()
		var s0 = s[0], s1 = s[1]
		o[0] = a[0] * s0
		o[1] = a[1] * s0
		o[2] = a[2] * s1
		o[3] = a[3] * s1
		return o
	}

	mat2.transpose = function(a, o){
		if(!o) o = mat2()
		var a01 = a[1]
		o[1] = a[2]
		o[2] = a01
		o[0] = a[0]
		o[3] = a[3]
		return o
	}

	mat2.outerProduct = function(c, r){
		if(!o) o = mat2()
		o[0] = c[0] * r[0]
		o[1] = c[0] * r[1]
		o[2] = c[1] * r[0]
		o[3] = c[1] * r[1]
		return o
	}

	matApi(mat3)

	mat3.identity = function(o){
		if(!o) o = mat3()
		o[0] = 1, o[1] = 0, o[2] = 0
		o[3] = 0, o[4] = 1, o[5] = 0
		o[6] = 0, o[7] = 0, o[8] = 1
		return o
	}

	mat3.transpose = function(a, o){
		if(!o) o = mat3()
		if (o === a) {
			var a01 = a[1], a02 = a[2], a12 = a[5]
			o[1] = a[3], o[2] = a[6], o[3] = a01
			m[5] = a[7], o[6] = a02, o[7] = a12
		} else {
			o[0] = a[0], o[1] = a[3], o[2] = a[6]
			o[3] = a[1], o[4] = a[4], o[5] = a[7]
			o[6] = a[2], o[7] = a[5], o[8] = a[8]
		}
		return o
	}

	mat3.invert = function(a, o){
		if(!o) o = mat3()
		var a00 = a[0], a01 = a[1], a02 = a[2],
			a10 = a[3], a11 = a[4], a12 = a[5],
			a20 = a[6], a21 = a[7], a22 = a[8],
			b01 = a22 * a11 - a12 * a21,
			b11 = -a22 * a10 + a12 * a20,
			b21 = a21 * a10 - a11 * a20,
			d = a00 * b01 + a01 * b11 + a02 * b21

		if (!d) return null

		d = 1.0 / d

		o[0] = b01 * d
		o[1] = (-a22 * a01 + a02 * a21) * d
		o[2] = (a12 * a01 - a02 * a11) * d
		o[3] = b11 * d
		o[4] = (a22 * a00 - a02 * a20) * d
		o[5] = (-a12 * a00 + a02 * a10) * d
		o[6] = b21 * d
		o[7] = (-a21 * a00 + a01 * a20) * d
		o[8] = (a11 * a00 - a01 * a10) * d
		return o
	}

	mat3.adjoint = function(a, o){
		if(!o) o = mat3()
		var a00 = a[0], a01 = a[1], a02 = a[2],
			a10 = a[3], a11 = a[4], a12 = a[5],
			a20 = a[6], a21 = a[7], a22 = a[8]

		o[0] = (a11 * a22 - a12 * a21)
		o[1] = (a02 * a21 - a01 * a22)
		o[2] = (a01 * a12 - a02 * a11)
		o[3] = (a12 * a20 - a10 * a22)
		o[4] = (a00 * a22 - a02 * a20)
		o[5] = (a02 * a10 - a00 * a12)
		o[6] = (a10 * a21 - a11 * a20)
		o[7] = (a01 * a20 - a00 * a21)
		o[8] = (a00 * a11 - a01 * a10)
		return o
	}

	mat3.determinant = function(a){
		return a[0] * (a[8] * a[4] - a[5] * a[7]) +
			a[1] * (-a[8] * a[3] + a[5] * a[6]) +
			a[2] * (a[7] * a[3] - a[4] * a[6])
	}

	mat3.mul =
	mat3.mat3_mul_mat3 = function(a, b, o){
		if(!o) o = mat3()
		var a00 = a[0], a01 = a[1], a02 = a[2],
			a10 = a[3], a11 = a[4], a12 = a[5],
			a20 = a[6], a21 = a[7], a22 = a[8],

			b00 = b[0], b01 = b[1], b02 = b[2],
			b10 = b[3], b11 = b[4], b12 = b[5],
			b20 = b[6], b21 = b[7], b22 = b[8]

		o[0] = b00 * a00 + b01 * a10 + b02 * a20
		o[1] = b00 * a01 + b01 * a11 + b02 * a21
		o[2] = b00 * a02 + b01 * a12 + b02 * a22

		o[3] = b10 * a00 + b11 * a10 + b12 * a20
		o[4] = b10 * a01 + b11 * a11 + b12 * a21
		o[5] = b10 * a02 + b11 * a12 + b12 * a22

		o[6] = b20 * a00 + b21 * a10 + b22 * a20
		o[7] = b20 * a01 + b21 * a11 + b22 * a21
		o[8] = b20 * a02 + b21 * a12 + b22 * a22
		return o
	}

	mat3.translate = function(a, b, o){
		if(!o) o = mat3()
		var a00 = a[0], a01 = a[1], a02 = a[2],
			a10 = a[3], a11 = a[4], a12 = a[5],
			a20 = a[6], a21 = a[7], a22 = a[8],
			x = v[0], y = v[1]

		o[0] = a00, o[1] = a01, o[2] = a02
		o[3] = a10, o[4] = a11, o[5] = a12
		o[6] = x * a00 + y * a10 + a20
		o[7] = x * a01 + y * a11 + a21
		o[8] = x * a02 + y * a12 + a22
		return o
	}

	mat3.rotate = function(a, angle, o){
		if(!o) o = mat3()

		var a00 = a[0], a01 = a[1], a02 = a[2],
			a10 = a[3], a11 = a[4], a12 = a[5],
			a20 = a[6], a21 = a[7], a22 = a[8],
			s = sin(angle), c = cos(angle)

		o[0] = c * a00 + s * a10, o[1] = c * a01 + s * a11, o[2] = c * a02 + s * a12
		o[3] = c * a10 - s * a00, o[4] = c * a11 - s * a01, o[5] = c * a12 - s * a02
		o[6] = a20,               o[7] = a21,               o[8] = a22
		return o
	}

	mat3.scale = function(a, v, o){
		if(!o) o = mat3()
		var x = v[0], y = v[1]
		o[0] = x * a[0], o[1] = x * a[1], o[2] = x * a[2]
		o[3] = y * a[3], o[4] = y * a[4], o[5] = y * a[5]
		o[6] = a[6],     o[7] = a[7],     o[8] = a[8]
		return o
	}

	mat3.fromQuat = function(q, o){
		if(!o) o = mat3()
		var x = q[0], y = q[1], z = q[2], w = q[3],
			x2 = x + x,  y2 = y + y,  z2 = z + z,
			xx = x * x2, yx = y * x2, yy = y * y2,
			zx = z * x2, zy = z * y2, zz = z * z2,
			wx = w * x2, wy = w * y2, wz = w * z2

		o[0] = 1 - yy - zz, o[1] = yx + wz,     o[2] = zx - wy,
		o[3] = yx - wz,     o[4] = 1 - xx - zz, o[5] = zy + wx,
		o[6] = zx + wy,     o[7] = zy - wx,     o[8] = 1 - xx - yy
		return o
	}

	mat3.normalFromMat4 = function(a, o){
		if(!o) o = mat3()

		var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3],
			a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7],
			a20 = a[8], a21 = a[9], a22 = a[10],a23 = a[11],
			a30 = a[12],a31 = a[13],a32 = a[14],a33 = a[15],
			b00 = a00 * a11 - a01 * a10, b01 = a00 * a12 - a02 * a10,
			b02 = a00 * a13 - a03 * a10, b03 = a01 * a12 - a02 * a11,
			b04 = a01 * a13 - a03 * a11, b05 = a02 * a13 - a03 * a12,
			b06 = a20 * a31 - a21 * a30, b07 = a20 * a32 - a22 * a30,
			b08 = a20 * a33 - a23 * a30, b09 = a21 * a32 - a22 * a31,
			b10 = a21 * a33 - a23 * a31, b11 = a22 * a33 - a23 * a32,
			det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06

		if (!det) return null
		det = 1.0 / det

		o[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det
		o[1] = (a12 * b08 - a10 * b11 - a13 * b07) * det
		o[2] = (a10 * b10 - a11 * b08 + a13 * b06) * det

		o[3] = (a02 * b10 - a01 * b11 - a03 * b09) * det
		o[4] = (a00 * b11 - a02 * b08 + a03 * b07) * det
		o[5] = (a01 * b08 - a00 * b10 - a03 * b06) * det

		o[6] = (a31 * b05 - a32 * b04 + a33 * b03) * det
		o[7] = (a32 * b02 - a30 * b05 - a33 * b01) * det
		o[8] = (a30 * b04 - a31 * b02 + a33 * b00) * det
		return o
	}

	mat3.outerProduct = function(c, r){
		if(!o) o = mat3()
		o[0] = c[0] * r[0], m01 = c[0] * r[1], m02 = c[0] * r[2]
		o[1] = c[1] * r[0], m11 = c[1] * r[1], m12 = c[1] * r[2]
		o[2] = c[2] * r[0], m21 = c[2] * r[1], m22 = c[2] * r[2]
		return o
	}

	matApi(mat4)

	mat4.debug = function(d, inline){
		var r = "";
		for(var i =0 ;i<16;i+=4){
			r += (Array(6).join(' ') + Math.round(d[i]*1000)/1000).slice(-6) + ", ";
			 r +=(Array(6).join(' ') +  Math.round(d[i+1]*1000)/1000).slice(-6) + ", ";
			 r += (Array(6).join(' ') + Math.round(d[i+2]*1000)/1000).slice(-6) + ", ";
			 r += (Array(6).join(' ') + Math.round(d[i+3]*1000)/1000).slice(-6) + "  ";
			if (!inline){
				console.log(r); r = "";
			}
		}
		if (inline) console.log(r);
	}

	mat4.identity = function(o){
		if(!o) o = mat4()
		o[0] = 1, o[1] = 0, o[2] = 0, o[3] = 0,
		o[4] = 0, o[5] = 1, o[6] = 0, o[7] = 0,
		o[8] = 0, o[9] = 0, o[10]= 1, o[11]= 0,
		o[12]= 0, o[13]= 0, o[14]= 0, o[15]= 1
		return o
	}

	mat4.isIdentity = function(o){
		return o[0] == 1 && o[1] == 0 && o[2] == 0 && o[3] == 0 &&
		o[4] == 0 && o[5] == 1 && o[6] == 0 && o[7] == 0 &&
		o[8] == 0 && o[9] == 0 && o[10]== 1 && o[11]== 0 &&
		o[12]== 0 && o[13]== 0 && o[14]== 0 && o[15]== 1
	}

	mat4.normalFromMat4 = function(a, o){
		if(!o) o = mat4()

		var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3],
			a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7],
			a20 = a[8], a21 = a[9], a22 = a[10],a23 = a[11],
			a30 = a[12],a31 = a[13],a32 = a[14],a33 = a[15],
			b00 = a00 * a11 - a01 * a10, b01 = a00 * a12 - a02 * a10,
			b02 = a00 * a13 - a03 * a10, b03 = a01 * a12 - a02 * a11,
			b04 = a01 * a13 - a03 * a11, b05 = a02 * a13 - a03 * a12,
			b06 = a20 * a31 - a21 * a30, b07 = a20 * a32 - a22 * a30,
			b08 = a20 * a33 - a23 * a30, b09 = a21 * a32 - a22 * a31,
			b10 = a21 * a33 - a23 * a31, b11 = a22 * a33 - a23 * a32,
			det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06

		if (!det) return null
		det = 1.0 / det

		o[0] = (a11 * b11 - a12 * b10 + a13 * b09) * det
		o[1] = (a12 * b08 - a10 * b11 - a13 * b07) * det
		o[2] = (a10 * b10 - a11 * b08 + a13 * b06) * det

		o[4] = (a02 * b10 - a01 * b11 - a03 * b09) * det
		o[5] = (a00 * b11 - a02 * b08 + a03 * b07) * det
		o[6] = (a01 * b08 - a00 * b10 - a03 * b06) * det

		o[8] = (a31 * b05 - a32 * b04 + a33 * b03) * det
		o[9] = (a32 * b02 - a30 * b05 - a33 * b01) * det
		o[10] = (a30 * b04 - a31 * b02 + a33 * b00) * det
		o[15] = 1.0;
		return o
	}

	mat4.T2 = function(t, o){
		if(!o) o = mat4()
		o[0] = 1, o[1] = 0, o[2] = 0, o[3] = t[0],
		o[4] = 0, o[5] = 1, o[6] = 0, o[7] = t[1],
		o[8] = 0, o[9] = 0, o[10]= 1, o[11]= t[2],
		o[12]= 0, o[13]= 0, o[14]= 0, o[15]= 1
		return o
	}

	mat4.T = function(tx, ty, tz, o){
		if(!o) o = mat4()
		o[0] = 1, o[1] = 0, o[2] = 0, o[3] = tx,
		o[4] = 0, o[5] = 1, o[6] = 0, o[7] = ty,
		o[8] = 0, o[9] = 0, o[10]= 1, o[11]= tz,
		o[12]= 0, o[13]= 0, o[14]= 0, o[15]= 1
		return o
	}

	mat4.S2 = function(s, o){
		if(!o) o = mat4()
		o[0] = s[0], o[1] = 0,   o[2] = 0,   o[3] = 0,
		o[4] = 0,   o[5] = s[1], o[6] = 0,   o[7] = 0,
		o[8] = 0,   o[9] = 0,   o[10]= s[2], o[11]= 0,
		o[12]= 0,   o[13]= 0,   o[14]= 0,   o[15]= 1
		return o
	}

	mat4.S = function(sx, sy, sz, o){
		if(!o) o = mat4()
		o[0] = sx,  o[1] = 0,   o[2] = 0,   o[3] = 0,
		o[4] = 0,   o[5] = sy,  o[6] = 0,   o[7] = 0,
		o[8] = 0,   o[9] = 0,   o[10]= sz,  o[11]= 0,
		o[12]= 0,   o[13]= 0,   o[14]= 0,   o[15]= 1
		return o
	}

	mat4.ST2 = function(s, t, o){
		if(!o) o = mat4()
		o[0] = s[0], o[1] = 0,    o[2] = 0,    o[3] = t[0],
		o[4] = 0,    o[5] = s[1], o[6] = 0,    o[7] = t[1],
		o[8] = 0,    o[9] = 0,    o[10]= s[2], o[11]= t[2],
		o[12]= 0,    o[13]= 0,    o[14]= 0,    o[15]= 1
		return o
	}

	mat4.ST = function(sx, sy, sz, tx, ty, tz, o){
		if(!o) o = mat4()
		o[0] = sx, o[1] = 0,   o[2] = 0,   o[3] = tx,
		o[4] = 0,  o[5] = sy,  o[6] = 0,   o[7] = ty,
		o[8] = 0,  o[9] = 0,   o[10]= sz,  o[11]= tz,
		o[12]= 0,  o[13]= 0,   o[14]= 0,   o[15]= 1
		return o
	}

	mat4.TS2 = function(t, s, o){
		if(!o) o = mat4()
		o[0] = s[0], o[1] = 0,    o[2] = 0,    o[3] = t[0]*s[0],
		o[4] = 0,    o[5] = s[1], o[6] = 0,    o[7] = t[1]*s[1],
		o[8] = 0,    o[9] = 0,    o[10]= s[2], o[11]= t[2]*s[2],
		o[12]= 0,    o[13]= 0,    o[14]= 0,    o[15]= 1
		return o
	}

	mat4.TS = function(tx, ty, tz, sx, sy, sz, o){
		if(!o) o = mat4()
		o[0] = sx,  o[1] = 0,   o[2] = 0,   o[3] = tx*sx,
		o[4] = 0,   o[5] = sy,  o[6] = 0,   o[7] = ty*sy,
		o[8] = 0,   o[9] = 0,   o[10]= sz,  o[11]= tz*sz,
		o[12]= 0,   o[13]= 0,   o[14]= 0,   o[15]= 1
		return o
	}

	mat4.R2 = function(r, o){
		if(!o) o = mat4()
		var cx = Math.cos(r[0]), cy = Math.cos(r[1]), cz = Math.cos(r[2])
		var sx = Math.sin(r[0]), sy = Math.sin(r[1]), sz = Math.sin(r[2])
		o[0] = cy * cz + sx * sy * sz,  o[1] = -sz*cy+cz*sx*sy,  o[2] = sy*cx,     o[3] = 0
		o[4] = sz * cx,                 o[5] = cx*cz,            o[6] = -sx,       o[7] = 0
		o[8] = -sy * cz + cy * sx * sz, o[9] = sy*sz+cy*sx*cz,   o[10] = cx * cy,  o[11] = 0
		o[13] = 0,                      o[13] = 0,               o[14] = 0,        o[15] = 1
		return o
	}

	mat4.R = function(rz, rx, ry, o){
		if(!o) o = mat4()
		var cx = Math.cos(rx), cy = Math.cos(ry), cz = Math.cos(rz)
		var sx = Math.sin(rx), sy = Math.sin(ry), sz = Math.sin(rz)
		o[0] = cy * cz + sx * sy * sz,  o[1] = -sz*cy+cz*sx*sy,  o[2] = sy*cx,     o[3] = 0
		o[4] = sz * cx,                 o[5] = cx*cz,            o[6] = -sx,       o[7] = 0
		o[8] = -sy * cz + cy * sx * sz, o[9] = sy*sz+cy*sx*cz,   o[10] = cx * cy,   o[11] = 0
		o[13] = 0,                       o[13] = 0,                o[14] = 0,         o[15] = 1
		return o
	}


	mat4.RT2 = function(r, t, o){
		if(!o) o = mat4()
		var cx = Math.cos(r[0]), cy = Math.cos(r[1]), cz = Math.cos(r[2])
		var sx = Math.sin(r[0]), sy = Math.sin(r[1]), sz = Math.sin(r[2])

		o[0] = cy * cz + sx * sy * sz,  o[1] = -sz*cy+cz*sx*sy,  o[2] = sy*cx,     o[3] = t[0]
		o[4] = sz * cx,                 o[5] = cx*cz,            o[6] = -sx,       o[7] = t[1]
		o[8] = -sy * cz + cy * sx * sz, o[9] = sy*sz+cy*sx*cz,   o[10] = cx * cy,   o[11] = t[2]
		o[13] = 0,                       o[13] = 0,                o[14] = 0,         o[15] = 1
		return o
	}

	mat4.RT = function(rx, ry, rz, tx, ty, tz, o){
		if(!o) o = mat4()
		var cx = Math.cos(rx), cy = Math.cos(ry), cz = Math.cos(rz)
		var sx = Math.sin(rx), sy = Math.sin(ry), sz = Math.sin(rz)
		o[0] = cy * cz + sx * sy * sz,  o[1] = -sz*cy+cz*sx*sy,  o[2] = sy*cx,     o[3] = tx
		o[4] = sz * cx,                 o[5] = cx*cz,            o[6] = -sx,       o[7] = ty
		o[8] = -sy * cz + cy * sx * sz, o[9] = sy*sz+cy*sx*cz,   o[10] = cx * cy,   o[11] = tz
		o[13] = 0,                       o[13] = 0,                o[14] = 0,         o[15] = 1
		return o
	}

	mat4.RT2 = function(r, t, o){
		if(!o) o = mat4()
		var cx = Math.cos(r[0]), cy = Math.cos(r[1]), cz = Math.cos(r[2])
		var sx = Math.sin(r[0]), sy = Math.sin(r[1]), sz = Math.sin(r[2])

		o[0] = cy * cz + sx * sy * sz,  o[1] = -sz*cy+cz*sx*sy,  o[2] = sy*cx,     o[3] = t[0]
		o[4] = sz * cx,                 o[5] = cx*cz,            o[6] = -sx,       o[7] = t[1]
		o[8] = -sy * cz + cy * sx * sz, o[9] = sy*sz+cy*sx*cz,   o[10] = cx * cy,   o[11] = t[2]
		o[13] = 0,                       o[13] = 0,                o[14] = 0,         o[15] = 1
	}

	mat4.TRT = function(t1x, t1y, t1z, rx, ry, rz, t2x, t2y, t2z, o){
		if(!o) o = mat4()
		var cx = Math.cos(rx), cy = Math.cos(ry), cz = Math.cos(rz)
		var sx = Math.sin(rx), sy = Math.sin(ry), sz = Math.sin(rz)
		o[0] = cy * cz + sx * sy * sz,  o[1] = -sz*cy+cz*sx*sy,  o[2] = sy*cx,     o[3] = t2x + o[0]*t1x + o[1]*t1y + o[2]*t1z
		o[4] = sz * cx,                 o[5] = cx*cz,            o[6] = -sx,       o[7] = t2y + o[4]*t1x + o[5]*t1y + o[6]*t1z
		o[8] = -sy * cz + cy * sx * sz, o[9] = sy*sz+cy*sx*cz,   o[10] = cx * cy,   o[11] = t2z + o[8]*t1x + o[9]*t1y + o[10]*t1z
		o[13] = 0,                       o[13] = 0,                o[14] = 0,         o[15] = 1
		return o
	}

	mat4.TRT2 = function(t1, r, t2, o){
		if(!o) o = mat4()
		var rx = r[0], ry = r[1], rz = r[2]
		var t1x = t1[0], t1y = t1[1], t1z = t[2]
		var t2x = t2[0], t2y = t2[1], t2z = t[2]
		var cx = Math.cos(rx), cy = Math.cos(ry), cz = Math.cos(rz)
		var sx = Math.sin(rx), sy = Math.sin(ry), sz = Math.sin(rz)
		o[0] = cy * cz + sx * sy * sz,  o[1] = -sz*cy+cz*sx*sy,  o[2] = sy*cx,     o[3] = t2x + o[0]*t1x + o[1]*t1y + o[2]*t1z
		o[4] = sz * cx,                 o[5] = cx*cz,            o[6] = -sx,       o[7] = t2y + o[4]*t1x + o[5]*t1y + o[6]*t1z
		o[8] = -sy * cz + cy * sx * sz, o[9] = sy*sz+cy*sx*cz,   o[10] = cx * cy,   o[11] = t2z + o[8]*t1x + o[9]*t1y + o[10]*t1z
		o[13] = 0,                       o[13] = 0,                o[14] = 0,         o[15] = 1
		return o
	}


	mat4.TSRT = function(t1x, t1y, t1z, mx, my, mz, rx, ry, rz, t2x, t2y, t2z, o){
		if(!o) o = mat4()
		var cx = Math.cos(rx), cy = Math.cos(ry), cz = Math.cos(rz)
		var sx = Math.sin(rx), sy = Math.sin(ry), sz = Math.sin(rz)
		o[0] = mx*(cy * cz + sx * sy * sz),  o[1] = my*(-sz*cy+cz*sx*sy),  o[2] = mz*(sy*cx),     o[3] = t2x + (o[0]*t1x + o[1]*t1y + o[2]*t1z)
		o[4] = mx*(sz * cx),                 o[5] = my*(cx*cz),            o[6] = mz*(-sx),       o[7] = t2y + (o[4]*t1x + o[5]*t1y + o[6]*t1z)
		o[8] = mx*(-sy * cz + cy * sx * sz), o[9] = my*(sy*sz+cy*sx*cz),   o[10] = mz*(cx * cy),   o[11] = t2z + (o[8]*t1x + o[9]*t1y + o[10]*t1z)
		o[13] = 0,                       o[13] = 0,                o[14] = 0,         o[15] = 1
		return o
	}

	mat4.TSRT2 = function(t1, m, r, t2, o){
		if(!o) o = mat4()
		var rx = r[0], ry = r[1], rz = r[2]
		var mx = m[0], my = m[1], mz = m[2]
		var t1x = t1[0], t1y = t1[1], t1z = t1[2]
		var t2x = t2[0], t2y = t2[1], t2z = t2[2]
		var cx = Math.cos(rx), cy = Math.cos(ry), cz = Math.cos(rz)
		var sx = Math.sin(rx), sy = Math.sin(ry), sz = Math.sin(rz)
		o[0] = mx*(cy * cz + sx * sy * sz),  o[1] = my*(-sz*cy+cz*sx*sy),  o[2] = mz*(sy*cx),     o[3] = t2x + (o[0]*t1x + o[1]*t1y + o[2]*t1z)
		o[4] = mx*(sz * cx),                 o[5] = my*(cx*cz),            o[6] = mz*(-sx),       o[7] = t2y + (o[4]*t1x + o[5]*t1y + o[6]*t1z)
		o[8] = mx*(-sy * cz + cy * sx * sz), o[9] = my*(sy*sz+cy*sx*cz),   o[10] = mz*(cx * cy),   o[11] = t2z + (o[8]*t1x + o[9]*t1y + o[10]*t1z)
		o[13] = 0,                       o[13] = 0,                o[14] = 0,         o[15] = 1
		return o
	}

	mat4.transpose = function(a, o){
		if(!o) o = mat4()
		if (a === o) {
			var a01 = a[1], a02 = a[2], a03 = a[3], a12 = a[6], a13 = a[7], a23 = a[11]
			o[1] = a[4], o[2] = a[8], o[3] = a[12],o[4] = a01
			o[6] = a[9], o[7] = a[13],o[8] = a02,  o[9] = a12
			o[11]= a[14], o[12]= a03,   o[13] = a13,  o[14]= a23
		}
		else {
			o[0] = a[0], o[1] = a[4], o[2] = a[8], o[3] = a[12]
			o[4] = a[1], o[5] = a[5], o[6] = a[9], o[7] = a[13]
			o[8] = a[2], o[9] = a[6], o[10] = a[10],o[11] = a[14]
			o[12] = a[3], o[13] = a[7], o[14] = a[11],o[15] = a[15]
		}
		return o
	}

	// Invert matrix a
	mat4.invert = function(a, o){
		if(!o) o = mat4()
		var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3],
			a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7],
			a20 = a[8], a21 = a[9], a22 = a[10],a23 = a[11],
			a30 = a[12],a31 = a[13],a32 = a[14],a33 = a[15],

			b00 = a00 * a11 - a01 * a10, b01 = a00 * a12 - a02 * a10,
			b02 = a00 * a13 - a03 * a10, b03 = a01 * a12 - a02 * a11,
			b04 = a01 * a13 - a03 * a11, b05 = a02 * a13 - a03 * a12,
			b06 = a20 * a31 - a21 * a30, b07 = a20 * a32 - a22 * a30,
			b08 = a20 * a33 - a23 * a30, b09 = a21 * a32 - a22 * a31,
			b10 = a21 * a33 - a23 * a31, b11 = a22 * a33 - a23 * a32,

			d = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06

		if (!d) return mat4.identity()
		d = 1.0 / d

		o[0]  = (a11 * b11 - a12 * b10 + a13 * b09) * d
		o[1]  = (a02 * b10 - a01 * b11 - a03 * b09) * d
		o[2]  = (a31 * b05 - a32 * b04 + a33 * b03) * d
		o[3]  = (a22 * b04 - a21 * b05 - a23 * b03) * d
		o[4]  = (a12 * b08 - a10 * b11 - a13 * b07) * d
		o[5]  = (a00 * b11 - a02 * b08 + a03 * b07) * d
		o[6]  = (a32 * b02 - a30 * b05 - a33 * b01) * d
		o[7]  = (a20 * b05 - a22 * b02 + a23 * b01) * d
		o[8]  = (a10 * b10 - a11 * b08 + a13 * b06) * d
		o[9]  = (a01 * b08 - a00 * b10 - a03 * b06) * d
		o[10] = (a30 * b04 - a31 * b02 + a33 * b00) * d
		o[11] = (a21 * b02 - a20 * b04 - a23 * b00) * d
		o[12] = (a11 * b07 - a10 * b09 - a12 * b06) * d
		o[13] = (a00 * b09 - a01 * b07 + a02 * b06) * d
		o[14] = (a31 * b01 - a30 * b03 - a32 * b00) * d
		o[15] = (a20 * b03 - a21 * b01 + a22 * b00) * d
		return o
	}

	mat4.adjoint = function(a, o) {
		if(!o) o = mat4()
		var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3],
			a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7],
			a20 = a[8], a21 = a[9], a22 = a[10],a23 = a[11],
			a30 = a[12],a31 = a[13],a32 = a[14],a33 = a[15]

		o[0]  =  (a11 * (a22 * a33 - a23 * a32) - a21 * (a12 * a33 - a13 * a32) + a31 * (a12 * a23 - a13 * a22))
		o[1]  = -(a01 * (a22 * a33 - a23 * a32) - a21 * (a02 * a33 - a03 * a32) + a31 * (a02 * a23 - a03 * a22))
		o[2]  =  (a01 * (a12 * a33 - a13 * a32) - a11 * (a02 * a33 - a03 * a32) + a31 * (a02 * a13 - a03 * a12))
		o[3]  = -(a01 * (a12 * a23 - a13 * a22) - a11 * (a02 * a23 - a03 * a22) + a21 * (a02 * a13 - a03 * a12))
		o[4]  = -(a10 * (a22 * a33 - a23 * a32) - a20 * (a12 * a33 - a13 * a32) + a30 * (a12 * a23 - a13 * a22))
		o[5]  =  (a00 * (a22 * a33 - a23 * a32) - a20 * (a02 * a33 - a03 * a32) + a30 * (a02 * a23 - a03 * a22))
		o[6]  = -(a00 * (a12 * a33 - a13 * a32) - a10 * (a02 * a33 - a03 * a32) + a30 * (a02 * a13 - a03 * a12))
		o[7]  =  (a00 * (a12 * a23 - a13 * a22) - a10 * (a02 * a23 - a03 * a22) + a20 * (a02 * a13 - a03 * a12))
		o[8]  =  (a10 * (a21 * a33 - a23 * a31) - a20 * (a11 * a33 - a13 * a31) + a30 * (a11 * a23 - a13 * a21))
		o[9]  = -(a00 * (a21 * a33 - a23 * a31) - a20 * (a01 * a33 - a03 * a31) + a30 * (a01 * a23 - a03 * a21))
		o[10] =  (a00 * (a11 * a33 - a13 * a31) - a10 * (a01 * a33 - a03 * a31) + a30 * (a01 * a13 - a03 * a11))
		o[11] = -(a00 * (a11 * a23 - a13 * a21) - a10 * (a01 * a23 - a03 * a21) + a20 * (a01 * a13 - a03 * a11))
		o[12] = -(a10 * (a21 * a32 - a22 * a31) - a20 * (a11 * a32 - a12 * a31) + a30 * (a11 * a22 - a12 * a21))
		o[13] =  (a00 * (a21 * a32 - a22 * a31) - a20 * (a01 * a32 - a02 * a31) + a30 * (a01 * a22 - a02 * a21))
		o[14] = -(a00 * (a11 * a32 - a12 * a31) - a10 * (a01 * a32 - a02 * a31) + a30 * (a01 * a12 - a02 * a11))
		o[15] =  (a00 * (a11 * a22 - a12 * a21) - a10 * (a01 * a22 - a02 * a21) + a20 * (a01 * a12 - a02 * a11))
		return o
	}

	// multiply matrix a with vector or matrix V
	mat4.mul =
	mat4.mat4_mul_mat4 = function(a, b, o){
		if(!o) o = mat4()
		var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3],
			a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7],
			a20 = a[8], a21 = a[9], a22 = a[10],a23 = a[11],
			a30 = a[12],a31 = a[13],a32 = a[14],a33 = a[15]

		var b0  = b[0], b1 = b[1], b2 = b[2], b3 = b[3]
		o[0] = b0*a00 + b1*a10 + b2*a20 + b3*a30
		o[1] = b0*a01 + b1*a11 + b2*a21 + b3*a31
		o[2] = b0*a02 + b1*a12 + b2*a22 + b3*a32
		o[3] = b0*a03 + b1*a13 + b2*a23 + b3*a33

		b0 = b[4], b1 = b[5], b2 = b[6], b3 = b[7]
		o[4] = b0*a00 + b1*a10 + b2*a20 + b3*a30
		o[5] = b0*a01 + b1*a11 + b2*a21 + b3*a31
		o[6] = b0*a02 + b1*a12 + b2*a22 + b3*a32
		o[7] = b0*a03 + b1*a13 + b2*a23 + b3*a33

		b0 = b[8], b1 = b[9], b2 = b[10], b3 = b[11]
		o[8] = b0*a00 + b1*a10 + b2*a20 + b3*a30
		o[9] = b0*a01 + b1*a11 + b2*a21 + b3*a31
		o[10] = b0*a02 + b1*a12 + b2*a22 + b3*a32
		o[11] = b0*a03 + b1*a13 + b2*a23 + b3*a33

		b0 = b[12], b1 = b[13], b2 = b[14], b3 = b[15]
		o[12] = b0*a00 + b1*a10 + b2*a20 + b3*a30
		o[13] = b0*a01 + b1*a11 + b2*a21 + b3*a31
		o[14] = b0*a02 + b1*a12 + b2*a22 + b3*a32
		o[15] = b0*a03 + b1*a13 + b2*a23 + b3*a33
		return o
	}

	// compute determinant of matrix a
	mat4.determinant = function(a){
		var b00 = a[0] * a[5] - a[1] * a[4], b01 = a[0] * a[6] - a[2] * a[4],
			b02 = a[0] * a[7] - a[3] * a[4], b03 = a[1] * a[6] - a[2] * a[5],
			b04 = a[1] * a[7] - a[3] * a[5], b05 = a[2] * a[7] - a[3] * a[6],
			b06 = a[8] * a[13] - a[9] * a[12], b07 = a[8] * a[14] - a[10] * a[12],
			b08 = a[8] * a[15] - a[11] * a[12], b09 = a[9] * a[14] - a[10] * a[13],
			b10 = a[9] * a[15] - a[11] * a[13], b11 = a[10] * a[15] - a[11] * a[14]

		// Calculate the determinant
		return b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;
	}

	// translate matrix a with vector V
	mat4.translate = function(a, v, o){
		if(!o) o = mat4()
		var x = v[0], y = v[1], z = v[2],
			a00, a01, a02, a03,
			a10, a11, a12, a13,
			a20, a21, a22, a23

		if (a === o) {
			o[12] = a[0] * x + a[4] * y + a[8] * z + a[12]
			o[13] = a[1] * x + a[5] * y + a[9] * z + a[13]
			o[14] = a[2] * x + a[6] * y + a[10] * z + a[14]
			o[15] = a[3] * x + a[7] * y + a[11] * z + a[15]
		}
		else {
			a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3]
			a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7]
			a20 = a[8], a21 = a[9], a22 = a[10],a23 = a[11]

			o[0] = a00, o[1] = a01, o[2] = a02, o[3] = a03
			o[4] = a10, o[5] = a11, o[6] = a12, o[7] = a13
			o[8] = a20, o[9] = a21, o[10] = a22,o[11] = a23

			o[12] = a00 * x + a10 * y + a20 * z + a[12]
			o[13] = a01 * x + a11 * y + a21 * z + a[13]
			o[14] = a02 * x + a12 * y + a22 * z + a[14]
			o[15] = a03 * x + a13 * y + a23 * z + a[15]
		}
		return o
	}

	mat4.scalematrix = function(v, o)
	{
		if(!o) {
			o = mat4.identity()
		}
		else{
			for (var i =0 ;i<16;i++) o[i] = 0;
		}
		o[0] = v[0];
		o[5] = v[1];
		o[10] = v[2];
		o[15] = 1;
		return o;

	}

	mat4.translatematrix = function(v, o)
	{
		if(!o) {
			o = mat4.identity()
		}
		else{
			for (var i =0 ;i<16;i++) o[i] = 0;
		}
		o[3] = v[0];
		o[7] = v[1];
		o[11] = v[2];
		o[15] = 1;
		return o;

	}


	// scale matrix a with vector V
	mat4.scale = function(a, v, o){
		if(!o) o = mat4()
		var x = v[0], y = v[1], z = v[2]

		o[0] = a[0] * x, o[1] = a[1] * x, o[2] = a[2] * x, o[3] = a[3] * x
		o[4] = a[4] * y, o[5] = a[5] * y, o[6] = a[6] * y, o[7] = a[7] * y
		o[8] = a[8] * z, o[9] = a[9] * z, o[10]= a[10]* z, o[11]= a[11] * z
		o[12]= a[12],    o[13]= a[13],    o[14]= a[14],    o[15]= a[15]
		return o
	}

	// rotate matrix a by angle A in radians around axis v
	mat4.rotate = function(a, angle, v, o){
		if(!o) o = mat4()
		var x = v[0], y = v[1], z = v[2],
			len = Math.sqrt(x * x + y * y + z * z),
			s = Math.sin(angle),
			c = Math.cos(angle),
			t = 1 - c,

		len = 1 / len
		x *= len, y *= len, z *= len

		if (abs(len) < 0.000001) return null

		var a00 = a[0], a01 = a[1], a02 = a[2],  a03 = a[3],
			a10 = a[4], a11 = a[5], a12 = a[6],  a13 = a[7],
			a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11]

		// Construct the elements of the rotation matrix
		var b00 = x * x * t + c,     b01 = y * x * t + z * s, b02 = z * x * t - y * s,
			b10 = x * y * t - z * s, b11 = y * y * t + c,     b12 = z * y * t + x * s,
			b20 = x * z * t + y * s, b21 = y * z * t - x * s, b22 = z * z * t + c

		// Perform rotation-specific matrix multiplication
		o[0] = a00 * b00 + a10 * b01 + a20 * b02
		o[1] = a01 * b00 + a11 * b01 + a21 * b02
		o[2] = a02 * b00 + a12 * b01 + a22 * b02
		o[3] = a03 * b00 + a13 * b01 + a23 * b02
		o[4] = a00 * b10 + a10 * b11 + a20 * b12
		o[5] = a01 * b10 + a11 * b11 + a21 * b12
		o[6] = a02 * b10 + a12 * b11 + a22 * b12
		o[7] = a03 * b10 + a13 * b11 + a23 * b12
		o[8] = a00 * b20 + a10 * b21 + a20 * b22
		o[9] = a01 * b20 + a11 * b21 + a21 * b22
		o[10]= a02 * b20 + a12 * b21 + a22 * b22
		o[11]= a03 * b20 + a13 * b21 + a23 * b22

		if (a !== o) { // If the source and destination differ, copy the unchanged last row
			o[12] = a[12]
			o[13] = a[13]
			o[14] = a[14]
			o[15] = a[15]
		}
		return o
	}

	// Rotate matrix a by angle A around x-axis
	mat4.rotateX = function(a, angle, o){
		if(!o) o = mat4()
		var s = Math.sin(angle), c = Math.cos(angle),
			a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7],
			a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11]

		if (a !== o){ // If the source and destination differ, copy the unchanged rows
			o[0] = a[0], o[1] = a[1], o[2] = a[2], o[3] = a[3]
			o[12] = a[12],o[13] = a[13],o[14] = a[14],o[15] = a[15]
		}

		// Perform axis-specific matrix multiplication
		o[4] = a10 * c + a20 * s, o[5] = a11 * c + a21 * s
		o[6] = a12 * c + a22 * s, o[7] = a13 * c + a23 * s
		o[8] = a20 * c - a10 * s, o[9] = a21 * c - a11 * s
		o[10] = a22 * c - a12 * s, o[11] = a23 * c - a13 * s
		return o
	}

	// rotate matrix a with angle R around y-axis
	mat4.rotateY = function(a, angle, o){
		if(!o) o = mat4()
		var s = Math.sin(angle), c = Math.cos(angle),
			a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3],
			a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11]

		if (a !== o) { // If the source and destination differ, copy the unchanged rows
			o[4] = a[4], o[5] = a[5], o[6] = a[6], o[7] = a[7]
			o[12]= a[12], o[13]= a[13], o[14]= a[14], o[15]= a[15]
		}

		// Perform axis-specific matrix multiplication
		o[0] = a00 * c - a20 * s, o[1] = a01 * c - a21 * s
		o[2] = a02 * c - a22 * s, o[3] = a03 * c - a23 * s
		o[8] = a00 * s + a20 * c, o[9] = a01 * s + a21 * c
		o[10] = a02 * s + a22 * c, o[11] = a03 * s + a23 * c
		return o
	}

	// rotate matrix a with angle R around z-axis
	mat4.rotateZ = function(a, angle, o){
		if(!o) o = mat4()
		var s = Math.sin(angle), c = Math.cos(angle),
			a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3],
			a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7]

		if (a !== o) { // If the source and destination differ, copy the unchanged last row
			o[8] = a[8],  o[9] = a[9],  o[10] = a[10], o[11] = a[11]
			o[12] = a[12], o[13] = a[13], o[14] = a[14], o[15] = a[15]
		}
		// Perform axis-specific matrix multiplication
		o[0] = a00 * c + a10 * s, o[1] = a01 * c + a11 * s
		o[2] = a02 * c + a12 * s, o[3] = a03 * c + a13 * s
		o[4] = a10 * c - a00 * s, o[5] = a11 * c - a01 * s
		o[6] = a12 * c - a02 * s, o[7] = a13 * c - a03 * s
		return o
	}

	// Create matrix from quaternion Q and translation V
	mat4.fromQuatTrans = function(q, v, o){
		if(!o) o = mat4()
		// Quaternion math
		var x = q[0], y = q[1], z = q[2], w = q[3],
			x2 = x + x,  y2 = y + y,  z2 = z + z,
			xx = x * x2, xy = x * y2, xz = x * z2,
			yy = y * y2, yz = y * z2, zz = z * z2,
			wx = w * x2, wy = w * y2, wz = w * z2

		o[0] = 1 - (yy + zz), o[1] = xy + wz,       o[2] = xz - wy,       o[3] = 0
		o[4] = xy - wz,       o[5] = 1 - (xx + zz), o[6] = yz + wx,       o[7] = 0
		o[8] = xz + wy,       o[9] = yz - wx,       o[10]= 1 - (xx + yy), o[11] = 0
		o[12] = v[0],        o[13] = v[1],          o[14]= v[2],          o[15] = 1
		return o
	}

	// Create matrix from quaternion Q
	mat4.fromQuat = function(q, o){
		if(!o) o = mat4()
		var x = q[0], y = q[1], z = q[2], w = q[3],
			x2 = x + x,  y2 = y + y,  z2 = z + z,
			xx = x * x2, yx = y * x2, yy = y * y2,
			zx = z * x2, zy = z * y2, zz = z * z2,
			wx = w * x2, wy = w * y2, wz = w * z2

		o[0] = 1 - yy - zz, o[1] = yx + wz,     o[2] = zx - wy,      o[3] = 0
		o[4] = yx - wz,     o[5] = 1 - xx - zz, o[6] = zy + wx,      o[7] = 0
		o[8] = zx + wy,     o[9] = zy - wx,     o[10] = 1 - xx - yy,  o[11] = 0
		o[12] = 0,           o[13] = 0,           o[14] = 0,            o[15] = 1
		return o
	}

	// Create matrix from left/right/bottom/top/near/far
	mat4.fustrum = function(L, R, T, B, N, F, o){
		if(!o) o = mat4()
		var rl = 1 / (R - L), tb = 1 / (T - B), nf = 1 / (N - F)
		o[0] = (N * 2) * rl, o[1] = 0,            o[2] = 0,                o[3] = 0
		o[4] = 0,            o[5] = (N * 2) * tb, o[6] = 0,                o[7] = 0
		o[8] = (R + L) * rl, o[9] = (T + B) * tb, o[10] = (F + N) * nf,     o[11] = -1
		o[12] = 0,            o[13] = 0,            o[14] = (F * N * 2) * nf, o[15] = 0
		return o
	}

	// Create perspective matrix FovY, Aspect, Near, Far
	mat4.perspective = function(FY, A, N, F, o){
		if(!o) o = mat4()
		var f = 1.0 / Math.tan(FY / 2), nf = 1 / (N - F)

		o[0] = f / A, o[4] = 0,  o[8] = 0,                 o[12] = 0
		o[1] = 0,     o[5] = f,  o[9] = 0,                 o[13] = 0
		o[2] = 0,     o[6] = 0,  o[10] = (F + N) * nf,      o[14] = -1
		o[3] = 0,     o[7] = 0,  o[11] = (2 * F * N) * nf,  o[15] = 0
		return o
	}

	// Create orthogonal proj matrix with Left/Right/Bottom/Top/Near/Far
	mat4.ortho = function(L, R, T, B, N, F, o){
		if(!o) o = mat4()
		var lr = 1 / (L - R), bt = 1 / (B - T), nf = 1 / (N - F)
		o[0] = -2 * lr,      o[4] = 0,            o[8] = 0,            o[12] = 0
		o[1] = 0,            o[5] = -2 * bt,      o[9] = 0,            o[13] = 0
		o[2] = 0,            o[6] = 0,            o[10] = 2 * nf,       o[14] = 0
		o[3] = (L + R) * lr, o[7] = (T + B) * bt, o[11] = (F + N) * nf, o[15] = 1
		return o
	}

	// Create look at matrix with Eye, LookAt, and Up vectors
	mat4.lookAt = function(eye, look, up, o){
		if(!o) o = mat4()
		var x0, x1, x2, y0, y1, y2, z0, z1, z2, len,
			ex = eye[0], ux = up[0], lx = look[0],
			ey = eye[1], uy = up[1], ly = look[1],
			ez = eye[2], uz = up[2], lz = look[2]

		if (Math.abs(ex - lx) < 0.000001 &&
			Math.abs(ey - ly) < 0.000001 &&
			Math.abs(ez - lz) < 0.000001) {
			return mat4.identity(o)
		}

		z0 = ex - lx, z1 = ey - ly, z2 = ez - lz
		len = 1 / sqrt(z0 * z0 + z1 * z1 + z2 * z2)
		z0 *= len, z1 *= len, z2 *= len

		x0 = uy * z2 - uz * z1, x1 = uz * z0 - ux * z2, x2 = ux * z1 - uy * z0
		len = sqrt(x0 * x0 + x1 * x1 + x2 * x2)

		if (!len)  x0 = 0, x1 = 0, x2 = 0
		else  len = 1 / len, x0 *= len, x1 *= len, x2 *= len

		y0 = z1 * x2 - z2 * x1, y1 = z2 * x0 - z0 * x2, y2 = z0 * x1 - z1 * x0
		len = sqrt(y0 * y0 + y1 * y1 + y2 * y2)

		if (!len)  y0 = 0, y1 = 0, y2 = 0
		else len = 1 / len, y0 *= len, y1 *= len, y2 *= len


		o[0] = x0, o[4] = y0,  o[8] = z0,  o[12] = 0
		o[1] = x1, o[5] = y1,  o[9] = z1,  o[13] = 0
		o[2] = x2, o[6] = y2, o[10] = z2,  o[14] = 0

		o[3] =  -(x0 * ex + x1 * ey + x2 * ez)
		o[7] =  -(y0 * ex + y1 * ey + y2 * ez)
		o[11] = -(z0 * ex + z1 * ey + z2 * ez)
		o[15] = 1
		return o
	}

	mat4.outerProduct = function(c, r, o){
		if(!o) o = mat4()
		o[0] = c[0] * r[0], o[1] = c[0] * r[1], o[2] = c[0] * r[2], o[3] = c[0] * r[3]
		o[4] = c[1] * r[0], o[5] = c[1] * r[1], o[6] = c[1] * r[2], o[7] = c[1] * r[3]
		o[8] = c[2] * r[0], o[9] = c[2] * r[1], o[10] = c[2] * r[2], o[11] = c[2] * r[3]
		o[12] = c[3] * r[0], o[13] = c[3] * r[1], o[14] = c[3] * r[2], o[15] = c[3] * r[3]
		return o
	}

	var ease = {}
	// easing functions on float
	ease.linear = function(t){ return t }
	ease.inquad = function(t){ return t*t }
	ease.outquad = function(t){ return -t*(t-2.) }
	ease.inoutquad = function(t){ return (t/=0.5) < 1. ? 0.5*t*t : -0.5 * ((--t)*(t-2.) - 1.) }
	ease.incubic = function(t){ return t*t*t }
	ease.outcubic = function(t){ return ((t=t-1)*t*t + 1) }
	ease.inoutcubic = function(t){ return (t/=0.5) < 1. ? 0.5*t*t*t : 1. /2.*((t-=2.)*t*t + 2.) }
	ease.inquart = function(t){ return t*t*t*t }
	ease.outquart = function(t){ return -((t=t-1.)*t*t*t - 1.) }
	ease.inoutquart = function(t){ return (t/=0.5) < 1. ? 0.5*t*t*t*t : -0.5 * ((t-=2.)*t*t*t - 2.) }
	ease.inquint = function(t){ return t*t*t*t*t }
	ease.outquint = function(t){ return ((t=t-1.)*t*t*t*t + 1.) }
	ease.inoutquint = function(t){ return (t/=0.5) < 1. ? 0.5*t*t*t*t*t : 0.5*((t-=2.)*t*t*t*t + 2.) }
	ease.insine = function(t){ return -cos(t * (PI/2.)) + 1. }
	ease.outsine = function(t){ return sin(t * (PI/2.)) }
	ease.inoutsine = function(t){ return -0.5 * (cos(PI*t) - 1.) }
	ease.inexpo = function(t){ return (t==0.)? 0.: pow(2., 10. * (t - 1.)) }
	ease.outexpo = function(t){ return (t==1.)? 1.: (-pow(2., -10. * t) + 1.) }
	ease.incirc = function(t){ return - (sqrt(1. - t*t) - 1.) }
	ease.outcirc = function(t){ return sqrt(1. - (t=t-1.)*t) }
	ease.inoutcirc = function(t){ return (t/=0.5) < 1.? -0.5 * (sqrt(1. - t*t) - 1.): 0.5 * (sqrt(1. - (t-=2.)*t) + 1.) }
	ease.inoutexpo = function(t){
		if (t==0.) return 0.
		if (t==1.) return 1.
		if ((t/=0.5) < 1.) return 0.5 * pow(2., 10. * (t - 1.))
		return 0.5 * (-pow(2., -10. * --t) + 2.)
	}

	ease.inelastic = function(t){
		var s=1.70158, p=0., a=1.;
		if (t==0.) return 0.
		if (t==1.) return 1.
		if (!p) p=0.3
		if (a < 1.) { a=1.; var s=p/4. }
		else var s = p/(2.*PI) * asin(1./a)
		return -(a*pow(2.,10.*(t-=1.)) * sin( (t*1.-s)*(2.*PI)/p ))
	}

	ease.outelastic = function(t){
		var s=1.70158, p=0., a=1.
		if (t==0.) return 0.
		if (t==1.) return 1.
		if (!p) p=1.*0.3
		if (a < 1.) { a=1.; var s=p/4.; }
		else var s = p/(2.*PI) * asin (1./a)
		return a*pow(2.,-10.*t) * sin( (t*1.-s)*(2.*PI)/p ) + 1.
	}

	ease.inoutelastic = function(t){
		var s=1.70158, p=0., a=1.
		if (t==0.) return 0.
		if ((t/=0.5)==2.) return 1.
		if (!p) p=(0.3*1.5)
		if (a < 1.) { a=1.; var s=p/4.; }
		else var s = p/(2.*PI) * asin (1./a)
		if (t < 1.) return -.5*(a*pow(2.,10.*(t-=1.)) * sin( (t*1.-s)*(2.*PI)/p ))
		return a*pow(2.,-10.*(t-=1.)) * sin( (t*1.-s)*(2.*PI)/p )*0.5 + 1.
	}

	ease.inback = function(t){ var s = 1.70158; return (t/=1.)*t*((s+1.)*t - s) }
	ease.outback = function(t){ var s = 1.70158; return ((t=t/1-1)*t*((s+1)*t + s) + 1) }
	ease.inoutback = function(t){
		var s = 1.70158
		if ((t/=0.5) < 1.) return 0.5*(t*t*(((s*=(1.525))+1.)*t - s))
		return 0.5*((t-=2.)*t*(((s*=(1.525))+1.)*t + s) + 2.)
	}

	ease.inbounce = function(t){
		return 1. - ease.outbounce(1.-t)
	}

	ease.outbounce = function(t){
		if (t < (1./2.75)) return (7.5625*t*t)
		else if (t < (2./2.75)) return (7.5625*(t-=(1.5/2.75))*t + 0.75)
		else if (t < (2.5/2.75)) return (7.5625*(t-=(2.25/2.75))*t + 0.9375)
		return (7.5625*(t-=(2.625/2.75))*t + .984375)
	}

	ease.inoutbounce = function(t){
		if (t < 0.5) return ease.inbounce (t*2.) * 0.5
		return ease.outbounce (t*2.-1.) * 0.5 + 0.5
	}

	ease.quad = function(t){ return ease.outquad(t)}
	ease.cubic = function(t){ return ease.inoutcubic(t) }
	ease.quart = function(t){ return ease.outquart(t) }
	ease.quint = function(t){ return ease.outquint(t) }
	ease.sine = function(t){ return ease.outsine(t) }
	ease.expo = function(t){ return ease.outexpo(t) }
	ease.elastic = function(t){return ease.outelastic(t) }
	ease.circ = function(t){ return ease.outcirc(t) }
	ease.back = function(t){ return ease.inoutback(t) }
	ease.bounce = function(t){ return ease.outbounce(t) }

	ease.bezier = function(control){
		var b = {}
		b.epsilon = 1.0/(200.0*time)
		b.points = control
		if(control.length != 4) control = [0,0,1,1]
		b.cx = 3.0*control[0]
		b.bx = 3.0 * (control[2] - control[0]) -b.cx
		b.ax = 1.0 - b.cx - b.bx
		b.cy = 3.0 * control[1]
		b.by = 3.0 * (control[3] - control[1]) - b.cy
		b.ay = 1.0 - b.cy - b.by

		function bezierCurveX(t) {
			return ((b.ax * t + b.bx) * t + b.cx) * t
		}

		function bezierCurveY(t) {
			return ((b.ay * t + b.by) * t + b.cy) * t
		}

		function bezierCurveDX(t) {
			return (3.0 * b.ax * t + 2.0 * b.bx) * t + b.cx
		}

		function bezierSolveX(x) {
			var t0, t1, t2, x2, d2, i
			// First try a few iterations of Newton's method -- normally very fast.
			for(t2 = x, i=0; i<8; i++) {
				x2 = bezierCurveX(t2) - x
				if(Math.abs(x2) < b.epsilon) return t2
				d2 = bezierCurveDX(t2)
				if(Math.abs(d2) < 1e-6) break
				t2 = t2 - x2 / d2
			}
			// Fall back to the bisection method for reliability.
			t0 = 0.0
			t1 = 1.0
			t2 = x
			if(t2 < t0) return t0
			if(t2 > t1) return t1
			while(t0 < t1) {
				x2 = bezierCurveX(t2)
				if(Math.abs(x2 - x) < b.epsilon) return t2
				if(x > x2) t0 = t2
				else t1 = t2
				t2 = (t1 - t0) *.5 + t0
			}
			return t2 // Failure.
		}

		return function(t){
			bezierCurveY(bezierSolveX(t))
		}
	}

	ease.bret = function(control){ // get the curve
		// pick a d that seems to make sense
		//return t
		var di = 0.01
		var df = 0.01
		// use the bezier array to pass in di and df
		if(control && control.points){
			if(control.points.length == 2){
				di = control.points[0]
				df = control.points[1]
			}
			else{
				di = df = control.points[0]
			}
		}

		var Xi = 0 // we go from 0
		var Xf = 1 // to 1 , as we are an motion function
		var Xo = Xi - di // as per email
		var Xn = Xf + df // here too
		// compute the constant
		var K = ((Xo - Xf) * (Xi - Xn)) / ((Xo - Xi) * (Xf - Xn))

		return function(t){
			// seems to be 1.20001
			var Kt = Math.pow(K, t)
			// so when t starts at 0 and ends at 1 K(t) is just K^t
			return (Xo * (Xi - Xn) + Xn * (Xo - Xi) * Kt) / ((Xo - Xi) * Kt + (Xi - Xn))
		}
	}

	float.ease = ease
})
