import type { Appointment, SpeechTemplate, RiskSpeech, ReviewTemplate } from '../types';

export const mockAppointments: Appointment[] = [
  {
    id: 'apt-001',
    patientId: 'p-001',
    patient: {
      id: 'p-001',
      name: '张明华',
      gender: '男',
      age: 45,
      phone: '138****1234',
      riskFactors: ['hypertension'],
      medications: '硝苯地平缓释片，每日1片',
      notes: '血压控制尚可，最近一次测量140/90'
    },
    date: '2026-06-20',
    time: '09:00',
    treatmentType: '洗牙',
    status: 'pending',
    doctorId: 'doc-001',
    doctorName: '李医生'
  },
  {
    id: 'apt-002',
    patientId: 'p-002',
    patient: {
      id: 'p-002',
      name: '王丽芬',
      gender: '女',
      age: 32,
      phone: '139****5678',
      riskFactors: ['pregnancy'],
      medications: '孕期复合维生素',
      notes: '孕24周，无其他不适'
    },
    date: '2026-06-20',
    time: '10:00',
    treatmentType: '补牙',
    status: 'in-progress',
    doctorId: 'doc-001',
    doctorName: '李医生'
  },
  {
    id: 'apt-003',
    patientId: 'p-003',
    patient: {
      id: 'p-003',
      name: '陈建国',
      gender: '男',
      age: 58,
      phone: '137****9012',
      riskFactors: ['diabetes', 'longTermMedication'],
      medications: '二甲双胍、阿司匹林',
      notes: '糖尿病史10年，空腹血糖8.5mmol/L'
    },
    date: '2026-06-20',
    time: '11:00',
    treatmentType: '拔牙',
    status: 'pending',
    doctorId: 'doc-001',
    doctorName: '李医生'
  },
  {
    id: 'apt-004',
    patientId: 'p-004',
    patient: {
      id: 'p-004',
      name: '林小美',
      gender: '女',
      age: 28,
      phone: '136****3456',
      riskFactors: [],
      notes: '无特殊病史'
    },
    date: '2026-06-20',
    time: '14:00',
    treatmentType: '根管治疗',
    status: 'pending',
    doctorId: 'doc-001',
    doctorName: '李医生'
  },
  {
    id: 'apt-005',
    patientId: 'p-005',
    patient: {
      id: 'p-005',
      name: '周志强',
      gender: '男',
      age: 62,
      phone: '135****7890',
      riskFactors: ['hypertension', 'longTermMedication'],
      medications: '缬沙坦、阿托伐他汀',
      notes: '高血压病史15年，冠心病史5年'
    },
    date: '2026-06-20',
    time: '15:00',
    treatmentType: '种植牙',
    status: 'pending',
    doctorId: 'doc-001',
    doctorName: '李医生'
  },
  {
    id: 'apt-006',
    patientId: 'p-006',
    patient: {
      id: 'p-006',
      name: '赵雅琴',
      gender: '女',
      age: 40,
      phone: '134****2345',
      riskFactors: [],
      notes: '无特殊病史'
    },
    date: '2026-06-20',
    time: '16:00',
    treatmentType: '正畸复查',
    status: 'pending',
    doctorId: 'doc-001',
    doctorName: '李医生'
  }
];

export const mockSpeechTemplates: SpeechTemplate[] = [
  {
    id: 'st-001',
    category: 'before-exam',
    treatmentType: '通用',
    contents: [
      '您好，请坐。今天是哪里不舒服呢？我先帮您检查一下口腔情况。',
      '我会先查看您的口腔整体情况，过程中如果有不适请举手示意。',
      '请问您最近有没有感觉牙齿有疼痛、松动或者牙龈出血的情况？'
    ],
    order: 1
  },
  {
    id: 'st-002',
    category: 'before-xray',
    treatmentType: '通用',
    contents: [
      '为了更清楚地了解情况，需要拍一张X光片。辐射剂量很小，相当于坐一次飞机飞行2小时的量，很安全。',
      '请您站好，身体不要动，咬紧咬合板，我帮您定位一下。很快就好。',
      '这个检查对诊断非常重要，能发现肉眼看不到的问题，比如牙根发炎、智齿位置等。'
    ],
    order: 1
  },
  {
    id: 'st-003',
    category: 'during-treatment',
    treatmentType: '洗牙',
    contents: [
      '现在开始洁牙，过程中可能会有轻微酸痛和牙龈少量出血，这是正常的，说明牙龈有炎症。',
      '如果觉得酸或者不舒服，请举左手示意，我会停下来。',
      '您牙结石比较多，洗完后可能会有短暂的冷热敏感，一两天就会好转。'
    ],
    order: 1
  },
  {
    id: 'st-004',
    category: 'during-treatment',
    treatmentType: '补牙',
    contents: [
      '现在要打麻药了，进针的时候会有一点点刺痛，就像蚂蚁咬一下，几秒钟就麻了。',
      '麻药起效后这半边脸和舌头会发麻，治疗过程不会疼，请放心。',
      '您现在觉得这半边脸木木的吗？好的，我们开始补牙，有任何不适请举手。'
    ],
    order: 2
  },
  {
    id: 'st-005',
    category: 'during-treatment',
    treatmentType: '拔牙',
    contents: [
      '麻药已经打好了，现在开始拔牙。您会感觉到有压力，但不会有疼痛，请放松。',
      '我现在在摇动牙齿，请配合张大口，很快就好。',
      '牙齿已经拔下来了，我帮您咬上棉花，请咬紧半小时，不要说话。'
    ],
    order: 3
  },
  {
    id: 'st-006',
    category: 'during-treatment',
    treatmentType: '根管治疗',
    contents: [
      '现在要给您做根管治疗，就是把发炎的牙神经取出来，清理干净后再补上。',
      '过程中可能需要拍几张小片来确认根管长度，请配合。',
      '治疗分两到三次完成，这次先放药消炎，一周后再来复诊。'
    ],
    order: 4
  },
  {
    id: 'st-007',
    category: 'during-treatment',
    treatmentType: '种植牙',
    contents: [
      '现在开始种植手术，已经打好麻药了，您只会感觉到震动，不会疼。',
      '手术大约需要半小时，我会随时告诉您进度，请保持放松。',
      '好了，种植体已经放好了，我给您缝几针，一周后来拆线。'
    ],
    order: 5
  },
  {
    id: 'st-008',
    category: 'post-treatment',
    treatmentType: '通用',
    contents: [
      '治疗完成了，您可以起来漱漱口。两小时内不要吃东西，麻药退了再吃。',
      '今天不要用治疗的那一边吃东西，尽量吃软的、温的食物。',
      '如果有轻微肿痛是正常反应，可以吃一片止疼药，明天就会好转。有问题随时打电话给我们。'
    ],
    order: 1
  }
];

export const mockRiskSpeeches: RiskSpeech[] = [
  {
    id: 'rs-001',
    riskType: 'hypertension',
    riskName: '高血压',
    questions: [
      '请问您今天早上吃降压药了吗？',
      '最近血压控制得怎么样？有没有头晕、胸闷的情况？',
      '最近有没有做过心电图检查？心脏情况还好吗？'
    ],
    disclaimers: [
      '因为您有高血压，治疗过程中我们会监测您的血压，尽量减少刺激。',
      '如果治疗过程中您感到头晕、心慌，请立刻告诉我们，我们会暂停处理。',
      '建议拔牙等有创治疗前，先把血压控制在140/90以下更安全。'
    ]
  },
  {
    id: 'rs-002',
    riskType: 'diabetes',
    riskName: '糖尿病',
    questions: [
      '请问您今天早上测血糖了吗？空腹血糖是多少？',
      '降糖药按时吃了吗？今天有没有吃早饭？',
      '最近有没有伤口不容易愈合的情况？'
    ],
    disclaimers: [
      '因为您有糖尿病，口腔治疗后感染风险会高一些，我们会特别注意消毒。',
      '治疗前请确保血糖控制在8.88mmol/L以下，这样更安全。',
      '治疗后请一定注意口腔卫生，按医嘱服用抗生素，有问题及时联系。'
    ]
  },
  {
    id: 'rs-003',
    riskType: 'pregnancy',
    riskName: '孕期',
    questions: [
      '请问您现在怀孕多少周了？是头胎吗？',
      '孕期有没有什么不舒服？产检都正常吗？',
      '之前有没有在孕期做过口腔治疗？'
    ],
    disclaimers: [
      '怀孕期间我们会尽量避免有创治疗和X光检查，以保守治疗为主。',
      '怀孕4-6个月是口腔治疗相对安全的时期，您现在这个阶段可以做简单治疗。',
      '我们会选择对胎儿安全的麻药，请不用太担心。如果治疗过程中有任何不适，请马上告诉我们。'
    ]
  },
  {
    id: 'rs-004',
    riskType: 'longTermMedication',
    riskName: '长期服药',
    questions: [
      '请问您长期服用的是什么药？服用多久了？',
      '最近有没有停药或者调整剂量？',
      '有没有因为服药出现过出血不止或者其他不适？'
    ],
    disclaimers: [
      '您长期服用的这个药可能会影响凝血功能，拔牙前可能需要暂时停药或者做凝血功能检查。',
      '请务必告知您的内科医生您要做口腔治疗，咨询是否需要调整用药。',
      '治疗后我们会特别注意止血，请您按医嘱咬棉球压迫止血，有问题及时复诊。'
    ]
  }
];

export const mockReviewTemplates: ReviewTemplate[] = [
  {
    id: 'rt-001',
    treatmentItem: '洗牙',
    verbalInstructions: [
      '今天洗完牙后，一两周内牙齿可能会有点敏感，不要吃太冷热的东西。',
      '坚持每天早晚刷牙，用牙线清洁牙缝，半年到一年洗一次牙。',
      '如果牙龈出血没有好转，一周后过来复查。'
    ],
    printedNotes: [
      '【洗牙后注意事项】',
      '1. 短期内牙齿可能敏感，避免过冷热刺激',
      '2. 正确刷牙：巴氏刷牙法，每次3分钟',
      '3. 每天使用牙线，清洁牙缝',
      '4. 半年至一年定期洗牙复查',
      '5. 如有持续出血、疼痛，请及时复诊'
    ]
  },
  {
    id: 'rt-002',
    treatmentItem: '补牙',
    verbalInstructions: [
      '补完牙两小时内不要吃东西，麻药退了再吃，暂时不要用补牙的那侧咀嚼。',
      '24小时内不要吃太硬太黏的东西，材料需要时间完全固化。',
      '如果咬合觉得高或者有疼痛，随时过来调整。'
    ],
    printedNotes: [
      '【补牙后注意事项】',
      '1. 两小时内勿进食，麻药消退后再饮食',
      '2. 24小时内避免用患侧咀嚼硬物',
      '3. 如出现咬合过高、疼痛，请及时复诊调合',
      '4. 建议每半年检查一次，发现问题及时处理'
    ]
  },
  {
    id: 'rt-003',
    treatmentItem: '拔牙',
    verbalInstructions: [
      '棉花咬紧半小时，不要吐口水，有血咽下去。',
      '24小时内不要漱口、刷牙，不要用舌头舔伤口，不要吸允。',
      '当天不要做剧烈运动，不要喝酒，吃温凉软的食物。如果出血不止或者发烧，马上回来。'
    ],
    printedNotes: [
      '【拔牙后注意事项】',
      '1. 止血棉球咬紧30-40分钟后吐出',
      '2. 24小时内禁止漱口、刷牙、吐口水',
      '3. 勿用舌舔、手摸创口，避免吸吮动作',
      '4. 当日进温凉软食，避免患侧咀嚼',
      '5. 禁止烟酒、剧烈运动、热水澡',
      '6. 如出血不止、剧烈疼痛、发热，请立即复诊',
      '7. 缝线者术后7天拆线'
    ]
  },
  {
    id: 'rt-004',
    treatmentItem: '根管治疗',
    verbalInstructions: [
      '这次已经放药消炎了，封的材料不要用它吃东西，掉了要马上回来补。',
      '这颗牙没有神经了，会比较脆，治疗完成后一定要做牙套保护起来。',
      '一周后再来复诊，如果这期间有肿痛，可以吃点消炎药，严重的话打电话给我们。'
    ],
    printedNotes: [
      '【根管治疗后注意事项】',
      '1. 治疗期间患牙可能有轻微胀痛，属正常反应',
      '2. 暂封材料勿用来咀嚼，如脱落请及时复诊',
      '3. 治疗期间避免用患侧进食硬物',
      '4. 按医嘱按时复诊，完成全部治疗',
      '5. 治疗完成后建议做牙冠修复，防止牙齿折裂',
      '6. 如有剧烈疼痛、肿胀，请及时联系医生'
    ]
  },
  {
    id: 'rt-005',
    treatmentItem: '种植牙',
    verbalInstructions: [
      '今天手术很顺利，24小时内不要漱口刷牙，冰敷可以减轻肿胀。',
      '吃温凉软的食物，不要用手术侧吃东西，注意休息。',
      '按医嘱吃消炎药和止痛药，一周后来拆线，三个月后装牙冠。'
    ],
    printedNotes: [
      '【种植牙术后注意事项】',
      '1. 术后24小时冰敷，每次15分钟，减轻肿胀',
      '2. 24小时内勿漱口、刷牙，次日可轻柔刷牙',
      '3. 进温凉软食，避免手术侧咀嚼',
      '4. 按医嘱服用抗生素、止痛药',
      '5. 术后7天拆线，3-6个月后取模做牙冠',
      '6. 保持口腔卫生，定期复查维护',
      '7. 如有剧烈疼痛、出血过多、发热，请立即复诊'
    ]
  },
  {
    id: 'rt-006',
    treatmentItem: '正畸复查',
    verbalInstructions: [
      '这次加力后可能会有两三天牙齿酸痛，是正常的，吃点软的食物。',
      '注意保持口腔卫生，每次吃完东西都要刷牙，不要吃太硬太黏的。',
      '如果有钢丝扎嘴或者托槽掉了，及时联系我们，两个月后再来复查。'
    ],
    printedNotes: [
      '【正畸复查后注意事项】',
      '1. 加力后2-3天牙齿酸痛属正常，可进软食',
      '2. 每次进食后必须刷牙，保持口腔清洁',
      '3. 避免进食过硬、过黏食物，防止托槽脱落',
      '4. 如出现钢丝扎嘴、托槽脱落，及时联系医生',
      '5. 按医嘱按时复诊，不要自行调整矫治器',
      '6. 坚持佩戴橡皮圈（如有），保证治疗效果'
    ]
  }
];

export const nextVisitOptions = [
  '一周后复诊',
  '两周后复诊',
  '一个月后复诊',
  '三个月后复诊',
  '半年后复查',
  '一年后复查',
  '有情况随时复诊'
];

export const treatmentItems = [
  '洗牙',
  '补牙',
  '拔牙',
  '根管治疗',
  '种植牙',
  '正畸复查',
  '牙冠修复',
  '活动义齿',
  '儿童牙齿检查'
];
