type EnterTransition = 'fade' | 'left-slide' | 'bottom-slide';

const STANZA_BREAK = Symbol('A break in the poem to move to the next stanza.');
const LINE_BREAK = Symbol('A break in the poem to move to the next line.');

type StanzaBreak = typeof STANZA_BREAK;
type LineBreak = typeof LINE_BREAK;
type Break = StanzaBreak | LineBreak;

export function isStanzaBreak(input: any): input is StanzaBreak {
	return input === STANZA_BREAK;
}

export function isLineBreak(input: any): input is LineBreak {
	return input === LINE_BREAK;
}

export function isBreak(input: any): input is Break {
	return isStanzaBreak(input) || isLineBreak(input);
}

const STREAMSIDE_THOUGHTS = [
	{
		lines: [
			{
				segments: [
					{
						values: ['here', 'i', 'sit'],
						beforeEachDelay: 800,
						enterTransition: 'fade'
					},
					{
						values: [', ', 'aside the once murky'],
						beforeAllDelay: 400,
						beforeEachDelay: 200,
						enterTransition: 'bottom-slide'
					},
					{
						values: [', now ', 'alight'],
						beforeEachDelay: 300
					}
				]
			}
		]
	}
];

type Value = string;

type LeafSegmentAnimationConfig = {
	values: Array<Value | Break>;
	beforeAllDelay?: number;
	beforeEachDelay?: number;
	enterTransition?: EnterTransition;
	style?: Partial<CSSStyleDeclaration>;
	getStyle?: (i: number) => Partial<CSSStyleDeclaration>;
	children?: never;
};

type ParentSegmentAnimationConfig = {
	values?: never;
	children: Array<SegmentAnimationConfig>;
};

type SegmentAnimationConfig = LeafSegmentAnimationConfig | ParentSegmentAnimationConfig;

function isLeafSegmentAnimationConfig(
	segmentAnimationConfig: SegmentAnimationConfig
): segmentAnimationConfig is LeafSegmentAnimationConfig {
	return Array.isArray(segmentAnimationConfig.values);
}

function isParentSegmentAnimationConfig(
	segmentAnimationConfig: SegmentAnimationConfig
): segmentAnimationConfig is ParentSegmentAnimationConfig {
	return Array.isArray(segmentAnimationConfig.children);
}

const poemLevel: SegmentAnimationConfig = {
	values: [
		'here i sit, aside the once murky, now alight once scared, now curious. but a stream cannot widen forever. as it winds on, can i take refuge here? here i am.'
	],
	beforeAllDelay: 400
};

const stanzaLevelSameAnimationEveryStanza: SegmentAnimationConfig = {
	values: [
		'here i sit, aside the once murky, now alight once scared, now curious.',
		STANZA_BREAK,
		'but a stream cannot widen forever. as it winds on, can i take refuge here? here i am.'
	],
	beforeAllDelay: 300
};

const stanzaLevelDifferentAnimationEveryStanza: SegmentAnimationConfig = {
	children: [
		{
			values: [
				'here i sit, aside the once murky, now alight once scared, now curious.',
				STANZA_BREAK
			],
			beforeAllDelay: 10000
		},
		{
			values: [
				'but a stream cannot widen forever. as it winds on, can i take refuge here? here i am.'
			],
			beforeAllDelay: 0
		}
	]
};

const lineLevelDifferentAnimationEveryLine: SegmentAnimationConfig = {
	children: [
		{
			values: ['here i sit, aside the once murky, now alight', LINE_BREAK],
			beforeAllDelay: 10000,
			style: {
				fontFamily: 'Roboto'
			}
		},
		{
			values: ['once scared, now curious.', LINE_BREAK],
			beforeAllDelay: 0
		},
		{
			values: ['but a stream cannot widen forever.', LINE_BREAK],
			beforeAllDelay: 10000
		},
		{
			values: ['as it winds on, can i take refuge here? here i am.', LINE_BREAK],
			beforeAllDelay: 0
		}
	]
};

const wordLevelOnFirstStanzaSameAnimationEveryWord: SegmentAnimationConfig = {
	children: [
		{
			values: [
				'here',
				'i',
				'sit,',
				'aside',
				'the',
				'once',
				'murky,',
				'now',
				'alight',
				LINE_BREAK,
				'once',
				'scared,',
				'now',
				'curious.',
				LINE_BREAK
			],
			beforeEachDelay: 30
		},
		{
			values: [
				'but a stream cannot widen forever. as it winds on, can i take refuge here? here i am.'
			],
			beforeAllDelay: 0
		}
	]
};

const wordLevelOnFirstStanzaSameAnimationEveryWordButInTwoGroups: SegmentAnimationConfig = {
	children: [
		{
			values: ['here', 'i', 'sit,', 'aside', 'the', 'once', 'murky,'],
			beforeEachDelay: 30
		},
		{
			values: ['now', 'alight', 'once', 'scared,', 'now', 'curious.'],
			beforeEachDelay: 300
		},
		{
			values: [
				'but a stream cannot widen forever. as it winds on, can i take refuge here? here i am.'
			],
			beforeAllDelay: 0
		}
	]
};

const characterLevelOnFirstWordGroup: SegmentAnimationConfig = {
	children: [
		{
			values: ['h', 'e', 'r', 'e'],
			beforeEachDelay: 20
		},
		{
			values: [
				'i',
				'sit,',
				'aside',
				'the',
				'once',
				'murky,',
				'now',
				'alight',
				'once',
				'scared,',
				'now',
				'curious.'
			],
			beforeEachDelay: 300
		},
		{
			values: [
				'but a stream cannot widen forever. as it winds on, can i take refuge here? here i am.'
			],
			beforeAllDelay: 0
		}
	]
};

const getTarget = () => document.querySelector('#target')!;

export async function play(segmentAnimationConfig: SegmentAnimationConfig): Promise<void> {
	if (isParentSegmentAnimationConfig(segmentAnimationConfig)) {
		for (const child of segmentAnimationConfig.children!) {
			await play(child);
		}
		return;
	}

	const target = getTarget();

	for (let i = 0; i < segmentAnimationConfig.values!.length; i++) {
		const value = segmentAnimationConfig.values[i];
		const style = segmentAnimationConfig.getStyle?.(i) ?? segmentAnimationConfig.style ?? {};
		const child = isBreak(value) ? document.createElement('br') : document.createElement('span');

		if (!isBreak(value)) {
			child.textContent = value;

			for (const [key, value] of Object.entries(style)) {
				//@ts-expect-error ignore key compliant
				if (value) child.style[key] = value;
			}
		}

		const beforeEachDelay = isBreak(value) ? 0 : segmentAnimationConfig.beforeEachDelay;

		await new Promise((resolve) => setTimeout(resolve, beforeEachDelay));

		target.appendChild(child);
	}
}
