import type { Appointment, SpeechTemplate, RiskSpeech, ReviewTemplate, ReviewHistory } from '../types';

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
    doctorName: '李医生',
    stage: 'waiting'
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
    doctorName: '李医生',
    stage: 'exam'
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
    doctorName: '李医生',
    stage: 'waiting'
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
    doctorName: '李医生',
    stage: 'waiting',
    lastReview: {
      id: 'rh-001',
      patientId: 'p-004',
      appointmentId: 'apt-004-prev',
      treatments: ['根管治疗'],
      nextVisit: '一周后复诊',
      verbalText: '林小美您好，今天给您做的是根管治疗。\n\n1. 这次已经放药消炎了，封的材料不要用它吃东西，掉了要马上回来补。\n\n2. 这颗牙没有神经了，会比较脆，治疗完成后一定要做牙套保护起来。\n\n3. 一周后再来复诊，如果这期间有肿痛，可以吃点消炎药，严重的话打电话给我们。\n\n下次请一周后复诊。',
      printedText: '================================\n      口腔治疗复诊单\n================================\n\n患者姓名：林小美\n性    别：女\n年    龄：28岁\n治疗项目：根管治疗\n治疗日期：2026/6/13\n\n【注意事项】\n【根管治疗后注意事项】\n1. 治疗期间患牙可能有轻微胀痛，属正常反应\n2. 暂封材料勿用来咀嚼，如脱落请及时复诊\n3. 治疗期间避免用患侧进食硬物\n4. 按医嘱按时复诊，完成全部治疗\n5. 治疗完成后建议做牙冠修复，防止牙齿折裂\n6. 如有剧烈疼痛、肿胀，请及时联系医生\n\n【复诊安排】\n一周后复诊\n\n医生签名：__________\n联系电话：400-888-8888\n================================\n',
      printedAt: '2026-06-13 15:30',
      createdAt: '2026-06-13 15:25'
    }
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
    doctorName: '李医生',
    stage: 'waiting'
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
    doctorName: '李医生',
    stage: 'waiting'
  },
  {
    id: 'apt-007',
    patientId: 'p-007',
    patient: {
      id: 'p-007',
      name: '刘小乐',
      gender: '男',
      age: 7,
      phone: '133****1111',
      riskFactors: [],
      notes: '儿童患者，配合度一般'
    },
    date: '2026-06-20',
    time: '10:30',
    treatmentType: '儿童牙齿检查',
    status: 'pending',
    doctorId: 'doc-001',
    doctorName: '李医生',
    stage: 'waiting'
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
  },
  {
    id: 'st-009',
    category: 'during-treatment',
    treatmentType: '牙冠修复',
    contents: [
      '现在要给您磨牙做牙冠，过程不会疼，可能会有点酸，请坚持一下。',
      '我会先把牙齿磨小一圈，然后取模型，一周后牙冠做好了再来戴。',
      '今天先给您做个临时牙冠戴着，不要用它吃太硬太黏的东西。'
    ],
    order: 6
  },
  {
    id: 'st-010',
    category: 'during-treatment',
    treatmentType: '活动义齿',
    contents: [
      '现在给您试戴假牙，可能会有点紧或者不舒服，这是正常的，适应几天就好。',
      '我帮您调整一下咬合，如果觉得哪里高或者顶着不舒服请告诉我。',
      '刚开始戴建议先吃软的食物，逐渐适应，每天晚上取下来泡在清水里。'
    ],
    order: 7
  },
  {
    id: 'st-011',
    category: 'before-exam',
    treatmentType: '儿童牙齿检查',
    contents: [
      '小朋友你好呀！我是给你检查牙齿的医生，我们来看看你的小白牙好不好？',
      '一会儿我会用小镜子看看你的牙齿，不会疼的，你只要张大口就好。',
      '真棒！检查完了我给你贴一个小贴纸，你要好好配合哦。'
    ],
    order: 8
  },
  {
    id: 'st-012',
    category: 'during-treatment',
    treatmentType: '儿童牙齿检查',
    contents: [
      '你看，这里有一颗小蛀牙，我们把它清理干净补起来就好了，不会疼的。',
      '涂氟的时候嘴巴里会有一点草莓味，不要咽下去，一会儿吐出来就好。',
      '做得很好！以后每天早晚都要认真刷牙，吃完甜食要漱口哦。'
    ],
    order: 9
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
    ],
    treatmentSuggestion: 'caution',
    suggestionText: '血压控制良好可谨慎进行简单治疗；拔牙、种植等有创手术建议血压控制在140/90mmHg以下再进行，术中需监测血压。'
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
    ],
    treatmentSuggestion: 'caution',
    suggestionText: '空腹血糖需控制在8.88mmol/L以下方可治疗；建议预防性使用抗生素，术后加强抗感染，注意伤口愈合情况。'
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
    ],
    treatmentSuggestion: 'defer',
    suggestionText: '孕期前3个月和后3个月建议暂缓择期治疗，仅处理急症；孕4-6个月可进行简单补牙、洗牙等；避免X光检查和有创手术。'
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
    ],
    treatmentSuggestion: 'caution',
    suggestionText: '需确认药物类型（如抗凝药、双膦酸盐等），必要时咨询内科医生是否需要临时停药；拔牙等有创操作术前需检查凝血功能。'
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
  },
  {
    id: 'rt-007',
    treatmentItem: '牙冠修复',
    verbalInstructions: [
      '今天戴的临时牙冠不要用来咬硬物，尤其是坚果、骨头这类。',
      '临时牙冠只是过渡用的，一周后正式牙冠做好了通知您来戴。',
      '如果临时牙冠掉了或者觉得咬合不舒服，随时打电话给我们。'
    ],
    printedNotes: [
      '【牙冠修复注意事项】',
      '1. 临时牙冠勿咬硬物，防止脱落或碎裂',
      '2. 如临时冠脱落，请保存好并及时复诊粘接',
      '3. 注意保持口腔卫生，正常刷牙使用牙线',
      '4. 一周后复诊佩戴正式牙冠',
      '5. 正式牙冠佩戴后如有咬合不适，请及时调合',
      '6. 建议每半年复查一次，延长牙冠使用寿命'
    ]
  },
  {
    id: 'rt-008',
    treatmentItem: '活动义齿',
    verbalInstructions: [
      '刚开始戴假牙会有点异物感，说话可能不太清楚，这是正常的，适应一周左右就好。',
      '先从软的食物开始练习，慢慢过渡到正常饮食，不要吃太硬太黏的东西。',
      '每天晚上睡觉前取下来用清水刷干净泡着，不要戴着睡觉，让牙龈休息一下。'
    ],
    printedNotes: [
      '【活动义齿注意事项】',
      '1. 初戴有异物感、发音不清属正常，1-2周后逐渐适应',
      '2. 先吃软食，逐渐过渡，避免过硬过黏食物',
      '3. 饭后取下清洗，保持口腔卫生',
      '4. 睡前取下浸泡于清水中，勿用热水或酒精',
      '5. 如出现压痛、松动、咬合不适，及时复诊调改',
      '6. 建议每半年复查一次，3-5年考虑更换义齿'
    ]
  },
  {
    id: 'rt-009',
    treatmentItem: '儿童牙齿检查',
    verbalInstructions: [
      '小朋友这次检查发现有两颗蛀牙，已经帮他补好了，回家要监督他认真刷牙哦。',
      '涂氟后半小时内不要吃东西、不要喝水、不要漱口，让涂氟剂充分发挥作用。',
      '每天早晚要帮小朋友刷牙，每次刷够三分钟，少吃甜食和碳酸饮料，每半年检查一次。'
    ],
    printedNotes: [
      '【儿童牙齿检查注意事项】',
      '1. 涂氟后30分钟内禁食、禁水、禁漱口',
      '2. 家长协助儿童早晚刷牙，每次不少于3分钟',
      '3. 控制甜食和碳酸饮料摄入，进食后及时漱口',
      '4. 建议使用含氟儿童牙膏（6岁以下豌豆粒大小）',
      '5. 每3-6个月定期复查，及时发现问题',
      '6. 如出现牙疼、牙龈肿胀等情况，请及时就诊'
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

export const XRAY_RECOMMENDATIONS: Record<string, { type: 'required' | 'optional' | 'not-recommended'; text: string }> = {
  '洗牙': { type: 'optional', text: '可选拍片检查牙槽骨吸收情况，评估牙周状况' },
  '补牙': { type: 'optional', text: '建议拍片确认龋坏深度，排除邻面龋' },
  '拔牙': { type: 'required', text: '必须拍片确认牙根形态、与神经管关系' },
  '根管治疗': { type: 'required', text: '必须拍片确认根管长度和根尖病变情况' },
  '种植牙': { type: 'required', text: '必须拍CBCT评估骨量、骨密度及重要解剖结构' },
  '正畸复查': { type: 'optional', text: '根据治疗进度决定是否需要拍片' },
  '牙冠修复': { type: 'optional', text: '建议术前拍片确认根管充填质量和根尖情况' },
  '活动义齿': { type: 'optional', text: '可选拍片评估余留牙和牙槽骨情况' },
  '儿童牙齿检查': { type: 'optional', text: '儿童建议每半年拍咬翼片筛查邻面龋' }
};
