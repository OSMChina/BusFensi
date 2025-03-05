import { confirmable, ConfirmDialog, ConfirmDialogProps } from 'react-confirm';
import CreateFeatureTags, { CreateNodeProps } from '../osm/CreateFeatureTags';
import { Tag } from '../../type/osm/meta';

type BaseProps = Omit<CreateNodeProps, "onClose" | "onSubmit" | "open">

type Props = ConfirmDialogProps<BaseProps, Tag[] | null>;

function DialogContent({ show, proceed, preset, title }: Props) {
    return <CreateFeatureTags
        preset={preset}
        title={title}
        open={show}
        onClose={() => proceed(null)}
        onSubmit={proceed}
    />
}

const CreateTagsConfirmation: ConfirmDialog<BaseProps, Tag[] | null> = (props) => (<DialogContent {...props} />);

export default confirmable(CreateTagsConfirmation);