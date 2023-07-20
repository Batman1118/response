const menu = {
	adminMenu: [{
		MenuTitle: "首页",
		Icon: "home",
		MenuID: "1",
		Children: [{
			MenuID: "11",
			MenuTitle: "控制面板",
			MenuPath: "/home",
		},
			{
				MenuID: "18",
				MenuTitle: "实时气象",
				MenuPath: "/wendy",
			},
			{
				MenuID: "12",
				MenuTitle: "我收到的",
				MenuPath: "/list"
			},
			{
				MenuID: "14",
				MenuTitle: "本级发出",
				MenuPath: "/release"
			},
			{
				MenuID: "13",
				MenuTitle: "数据统计",
				MenuPath: "/audit"
			}
		],
	},
		{
			MenuTitle: "预警信息管理",
			Icon: "mail",
			MenuID: "2",
			Children: [{
				MenuID: "21",
				MenuTitle: "信息编辑",
				MenuPath: "/notice",
			},
				{
					MenuID: "22",
					MenuTitle: "信息审核",
					MenuPath: "/msgReview",
				},
				{
					MenuID: "23",
					MenuTitle: "信息发布",
					MenuPath: "/report",
				},
				{
					MenuID: "24",
					MenuTitle: "历史信息",
					MenuPath: "/history",
				},
				{
					MenuID: "25",
					MenuTitle: "叫应记录",
					MenuPath: "/callRecord",
				},
			],
		},
		{
			MenuTitle: "短信管理",
			Icon: "message",
			MenuID: "3",
			Children: [{
				MenuID: "31",
				MenuTitle: "常规群发",
				MenuPath: "/massSend",
			},
				{
					MenuID: "32",
					MenuTitle: "短信记录",
					MenuPath: "/msgRecord",
				},
				{
					MenuID: "33",
					MenuTitle: "平级接收人管理",
					MenuPath: "/samelevel",
				},
				{
					MenuID: "34",
					MenuTitle: "原通讯录",
					MenuPath: "/addressBook",
				}
			],
		},
		{
			MenuTitle: "设置",
			Icon: "setting",
			MenuID: "4",
			Children: [{
				MenuID: "41",
				MenuTitle: "用户管理",
				MenuPath: "/user",
			},
				{
					MenuID: "42",
					MenuTitle: "短信平台设置",
					MenuPath: "/smsSetting",
				},
				// {
				// 	MenuID: "43",
				// 	MenuTitle: "菜单权限",
				// 	MenuPath: "/menu",
				// },
			],
		},
	],
	leaderMenu: [{
		MenuTitle: "首页",
		Icon: "home",
		MenuID: "1",
		Children: [{
			MenuID: "11",
			MenuTitle: "控制面板",
			MenuPath: "/home",
		},
			{
				MenuID: "18",
				MenuTitle: "实时气象",
				MenuPath: "/wendy",
			},
			{
				MenuID: "13",
				MenuTitle: "数据统计",
				MenuPath: "/audit"
			}
		],
	},
		{
			MenuTitle: "预警信息管理",
			Icon: "mail",
			MenuID: "2",
			Children: [
				{
					MenuID: "22",
					MenuTitle: "信息审核",
					MenuPath: "/msgReview",
				},
			],
		}
	],
	workerMenu: [{
		MenuTitle: "首页",
		Icon: "home",
		MenuID: "1",
		Children: [{
			MenuID: "11",
			MenuTitle: "控制面板",
			MenuPath: "/home",
		},
			{
				MenuID: "18",
				MenuTitle: "实时气象",
				MenuPath: "/wendy",
			},
			{
				MenuID: "12",
				MenuTitle: "我收到的",
				MenuPath: "/list"
			},
			{
				MenuID: "14",
				MenuTitle: "本级发出",
				MenuPath: "/release"
			},
			{
				MenuID: "13",
				MenuTitle: "数据统计",
				MenuPath: "/audit"
			}
		],
	},
		{
			MenuTitle: "预警信息管理",
			Icon: "mail",
			MenuID: "2",
			Children: [{
				MenuID: "21",
				MenuTitle: "信息编辑",
				MenuPath: "/notice",
			},
				{
					MenuID: "23",
					MenuTitle: "信息发布",
					MenuPath: "/report",
				},
				{
					MenuID: "24",
					MenuTitle: "历史信息",
					MenuPath: "/history",
				},
				{
					MenuID: "25",
					MenuTitle: "叫应记录",
					MenuPath: "/callRecord",
				},
			],
		},
		{
			MenuTitle: "短信管理",
			Icon: "message",
			MenuID: "3",
			Children: [{
				MenuID: "31",
				MenuTitle: "常规群发",
				MenuPath: "/massSend",
			},
				{
					MenuID: "32",
					MenuTitle: "短信记录",
					MenuPath: "/msgRecord",
				},
				{
					MenuID: "33",
					MenuTitle: "平级接收人管理",
					MenuPath: "/samelevel",
				},
				{
					MenuID: "34",
					MenuTitle: "原通讯录",
					MenuPath: "/addressBook",
				}
			],
		},
		{
			MenuTitle: "设置",
			Icon: "setting",
			MenuID: "4",
			Children: [{
				MenuID: "41",
				MenuTitle: "用户管理",
				MenuPath: "/user",
			},
				{
					MenuID: "42",
					MenuTitle: "短信平台设置",
					MenuPath: "/smsSetting",
				},
				// {
				// 	MenuID: "43",
				// 	MenuTitle: "菜单权限",
				// 	MenuPath: "/menu",
				// },
			],
		},
	]
}

export default menu;