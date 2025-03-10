import { ConfirmDialog, ConfirmDialogProps } from 'react-confirm';
import CreateFeatureTags, { CreateNodeProps } from '../osm/CreateFeatureTags';
import { Tag } from '../../type/osm/meta';

type BaseProps = Omit<CreateNodeProps, "onClose" | "onSubmit" | "open">

type Props = ConfirmDialogProps<BaseProps, Tag[] | null>;

function DialogContent({ show, proceed, ...rest }: Props) {
    return <CreateFeatureTags
        open={show}
        {...rest}
        onClose={() => proceed(null)}
        onSubmit={proceed}
    />
}

export const CreateTagsConfirmation: ConfirmDialog<BaseProps, Tag[] | null> = (props) => (<DialogContent {...props} />);